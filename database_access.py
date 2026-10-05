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

if __name__ == "__main__":
    pull_data()
