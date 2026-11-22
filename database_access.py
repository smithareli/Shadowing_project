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


def pull_data(user_id):
    with get_cursor() as cur:
        cur.execute("SELECT start_date, end_date, is_current, is_predicted FROM cycle WHERE userid = %s ORDER BY start_date;", (user_id,))
        return cur.fetchall()
def pull_history(user_id):
    with get_cursor() as cur:
        cur.execute("SELECT start_date, end_date, is_current, is_predicted FROM cycle WHERE is_predicted = FALSE AND userid = %s ORDER BY start_date;", (user_id,))
        return cur.fetchall()
def replace_current_cycle(start, end, user_id):
    print("replace_current_cycle CALLED", user_id)
    with get_cursor() as cur:
        cur.execute("DELETE FROM cycle WHERE is_predicted = TRUE AND userid= %s;", (user_id,))
        cur.execute("DELETE FROM CYCLE WHERE is_current=TRUE AND userid= %s;", (user_id,))
        cur.execute(
                    """INSERT INTO cycle (user_id, start_date, end_date, ovulation_phase_sd,
                                        luteal_phase_sd, is_predicted, is_current, created_at, userid)
                    VALUES (NULL, %s, %s, NULL, NULL, FALSE, TRUE, now(), %s);""",
                    (start, end, user_id),
                )

def check_cycle(user_id):
    with get_cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM cycle WHERE is_predicted = TRUE AND userid = %s;", (user_id,))
        num_predicted = cur.fetchone()["count"]
        return max(0, 2 - num_predicted)


def add_new_cycle(start_date, end_date, current, predicted, created_at, user_id):
    with get_cursor() as cur:
        cur.execute(
            """INSERT INTO cycle (user_id, start_date, end_date, ovulation_phase_sd,
                                  luteal_phase_sd, is_predicted, is_current, created_at, userid)
               VALUES (NULL, %s, %s, NULL, NULL, %s, %s, %s, %s);""",
            (start_date, end_date, predicted, current, created_at, user_id),
        )
def get_current_date():
    with get_cursor() as cur:
        cur.execute("SELECT CURRENT_DATE AS current_date;")
        return cur.fetchone()["current_date"]


def add_daily_insight(phase, user_id, symptom=None, Tips=None, Reccommendations=None, Task_ids=None):
    with get_cursor() as cur:
        cur.execute("SELECT pg_advisory_xact_lock(4301, 1);")
        cur.execute(
            """INSERT INTO daily_insights (symptoms, recommendations, tips, task_ids, phase, daily_date, userid)
               SELECT %s, %s, %s, %s, %s, CURRENT_DATE, %s
               WHERE NOT EXISTS (
                   SELECT 1 FROM daily_insights WHERE daily_date = CURRENT_DATE
               );""",
            (symptom, Reccommendations, Tips, Task_ids, phase, user_id),
        )


def get_daily_insight(user_id):
    with get_cursor() as cur:
        cur.execute(
            """SELECT * FROM daily_insights
               WHERE daily_date = CURRENT_DATE AND userid = %s
               LIMIT 1;""", (user_id,)
        )
        return cur.fetchall()
def delete_todays_insight(user_id):
    with get_cursor() as cur:
        cur.execute("DELETE FROM daily_insights WHERE daily_date = CURRENT_DATE AND userid = %s;", (user_id,))

def check_daily_insight(user_id):
    with get_cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM daily_insights WHERE daily_date = CURRENT_DATE AND userid = %s;", (user_id,))
        num_insights = cur.fetchone()["count"]
        return num_insights > 0
def add_task(task_name, task_description, task_location, task_start_date, task_end_date, task_start_time, task_end_time,user_id,external_id=None, source="manual"):
    with get_cursor() as cur:
        cur.execute(
            """INSERT INTO task (name, description, location, start_date, end_date, start_time, end_time, external_id, source, userid)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
               ON CONFLICT (external_id) DO UPDATE SET
               name=EXCLUDED.name,
               description= EXCLUDED.description,
               location= EXCLUDED.location,
               start_date= EXCLUDED.start_date,
               end_date= EXCLUDED.end_date,
               start_time= EXCLUDED.start_time,
               end_time = EXCLUDED.end_time;""",
            (task_name, task_description, task_location, task_start_date, task_end_date, task_start_time, task_end_time, external_id, source, user_id),
        )
def get_tasks(user_id):
    with get_cursor() as cur:
        cur.execute("""
            SELECT * FROM task
            WHERE start_date <= (NOW() AT TIME ZONE 'America/New_York')::date
            AND end_date   >= (NOW() AT TIME ZONE 'America/New_York')::date AND userid= %s;
        """, (user_id,))       
        return cur.fetchall()
def add_goals(productivity, fitness, energy, learning, user_id):
    with get_cursor() as cur:
        cur.execute(""" UPDATE profile SET goals = ARRAY[%s,%s,%s,%s] WHERE userid=%s;""", (productivity, fitness, energy, learning, user_id)
        )
        row = cur.fetchone()
        return row["goals"] if row else None
def get_goals(user_id):
    with get_cursor() as cur:
        cur.execute("SELECT goals FROM profile WHERE userid = %s;", (user_id,))
        row=cur.fetchone()
        g = (row["goals"] if row and row["goals"] else [None] * 4)
        return {"productivity": g[0], "fitness": g[1], "energy": g[2], "learning": g[3]}