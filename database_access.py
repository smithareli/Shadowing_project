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
        cur.execute("SELECT start_date, end_date FROM cycle;")
        return cur.fetchall()


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