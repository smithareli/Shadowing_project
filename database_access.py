import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor


load_dotenv()
def pull_data():
    with psycopg2.connect(os.getenv("DATABASE_URL")) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT start_date, end_date FROM cycle;")
            return cur.fetchall()
def check_cycle():
    with psycopg2.connect(os.getenv("DATABASE_URL")) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT COUNT(*) FROM cycle WHERE is_predicted = TRUE;")
            num_predicted = cur.fetchone()[0]
            if num_predicted ==0:
                return 2
            elif num_predicted == 1:
                return 1
            else:
                return 0
def add_new_cycle(start_date, end_date, current, predicted,created_at):
    with psycopg2.connect(os.getenv("DATABASE_URL")) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "INSERT INTO cycle (user_id, start_date, end_date,ovulation_phase_sd, luteal_phase_sd, is_predicted, is_current, created_at) VALUES (NULL, %s, %s,NULL, NULL, %s, %s, %s);",
                (start_date, end_date, predicted, current, created_at)
            )
        conn.commit()
if __name__ == "__main__":
    pull_data()
    check_cycle()
    
