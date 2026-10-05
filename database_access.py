import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()
def pull_data():
    try:
        with psycopg2.connect(os.getenv("DATABASE_URL")) as conn:
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                
                query = "SELECT start_date, end_date FROM cycle;"
                cur.execute(query)
                
                rows = cur.fetchall()
                
                #print(f"Successfully pulled {len(rows)} records:\n")
                for row in rows:
                    print(f"Start: {row['start_date']} | End: {row['end_date']}")
                return rows                    
    except Exception as error:
        print(f"Error while connecting to Neon: {error}")

if __name__ == "__main__":
    pull_data()
