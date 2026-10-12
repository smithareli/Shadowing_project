import json
from dotenv import load_dotenv
from database_access import pull_data, check_cycle, add_new_cycle, add_daily_insight
from gemini_calls import predict_next_cycles
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import os
import psycopg2

client = genai.Client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
load_dotenv()

@app.get("/")
# def reset_cycle_id():
#     with psycopg2.connect(os.getenv("DATABASE_URL")) as conn:
#         try:
#             with conn:
#                 with conn.cursor() as cur:
#                     cur.execute("""
#                         SELECT setval(
#                         pg_get_serial_sequence('cycle', 'id'),
#                         COALESCE((SELECT MAX(id) FROM cycle), 0) + 1,
#                         false
#                         );
#                     """)
#                     print(cur.fetchone())
#         finally:
#             conn.close()
def get_data():
    rows = pull_data()
    predicted = check_cycle()
    if predicted>0:
        rows = predict_next_cycles(rows, predicted)


    
    return {"dates": rows}
