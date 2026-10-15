import os
from contextlib import contextmanager
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()


@contextmanager
def get_cursor():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    try:
        with conn:  # commits on success, rolls back on error
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                yield cur
    finally:
        conn.close()  # runs after the transaction is finished


def pull_data():
    with get_cursor() as cur:
        cur.execute("SELECT start_date, end_date, is_current, is_predicted FROM cycle ORDER BY start_date;")
        return cur.fetchall()
def pull_history():
    with get_cursor() as cur:
        cur.execute("SELECT start_date, end_date, is_current, is_predicted FROM cycle WHERE is_predicted = FALSE ORDER BY start_date;")
        return cur.fetchall()
def replace_current_cycle(start, end):
    with get_cursor() as cur:
        cur.execute("DELETE FROM cycle WHERE is_predicted = TRUE;")
        cur.execute("DELETE FROM CYCLE WHERE is_current=TRUE;")
        cur.execute(
                    """INSERT INTO cycle (user_id, start_date, end_date, ovulation_phase_sd,
                                        luteal_phase_sd, is_predicted, is_current, created_at)
                    VALUES (NULL, %s, %s, NULL, NULL, FALSE, TRUE, now());""",
                    (start, end),
                )

def check_cycle():
    with get_cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM cycle WHERE is_predicted = TRUE;")
        num_predicted = cur.fetchone()["count"]
        return max(0, 2 - num_predicted)


def add_new_cycle(start_date, end_date, current, predicted, created_at):
    with get_cursor() as cur:
        cur.execute(
            """INSERT INTO cycle (user_id, start_date, end_date, ovulation_phase_sd,
                                  luteal_phase_sd, is_predicted, is_current, created_at)
               VALUES (NULL, %s, %s, NULL, NULL, %s, %s, %s);""",
            (start_date, end_date, predicted, current, created_at),
        )
def get_current_date():
    with get_cursor() as cur:
        cur.execute("SELECT CURRENT_DATE AS current_date;")
        return cur.fetchone()["current_date"]


def add_daily_insight(phase, symptom=None, Tips=None, Reccommendations=None, Task_ids=None):
    with get_cursor() as cur:
        cur.execute("SELECT pg_advisory_xact_lock(4301, 1);")
        cur.execute(
            """INSERT INTO daily_insights (symptoms, recommendations, tips, task_ids, phase, daily_date)
               SELECT %s, %s, %s, %s, %s, CURRENT_DATE
               WHERE NOT EXISTS (
                   SELECT 1 FROM daily_insights WHERE daily_date = CURRENT_DATE
               );""",
            (symptom, Reccommendations, Tips, Task_ids, phase),
        )


def get_daily_insight():
    with get_cursor() as cur:
        cur.execute(
            """SELECT * FROM daily_insights
               WHERE daily_date = CURRENT_DATE
               LIMIT 1;"""
        )
        return cur.fetchall()
def delete_todays_insight():
    with get_cursor() as cur:
        cur.execute("DELETE FROM daily_insights WHERE daily_date = CURRENT_DATE;")

def check_daily_insight():
    with get_cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM daily_insights WHERE daily_date = CURRENT_DATE;")
        num_insights = cur.fetchone()["count"]
        return num_insights > 0