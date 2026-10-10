import json
from dotenv import load_dotenv
from database_access import pull_data, check_cycle, add_new_cycle
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
def reset_cycle_id():
    with psycopg2.connect(os.getenv("DATABASE_URL")) as conn:
        try:
            with conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT setval(
                        pg_get_serial_sequence('cycle', 'id'),
                        COALESCE((SELECT MAX(id) FROM cycle), 0) + 1,
                        false
                        );
                    """)
                    print(cur.fetchone())
        finally:
            conn.close()
def get_data():
    rows = pull_data()
    predicted = check_cycle()
    add_new_cycle("2026-11-04", "2026-11-09", False, True, "2026-10-09")
        # if predicted>0:
        #     interaction = client.interactions.create(
        #     model="gemini-3.8-flash",
        #     input="Predict the next " + str(predicted) + " cycles using this data: " + str(rows),
        #     response_format={
        #         "type": "text",
        #         "mime_type": "application/json",
        #         "schema": {
        #             "type": "object",
        #             "properties": {
        #                 "cycles": {
        #                     "type": "array",
        #                     "items": {
        #                         "type": "object",
        #                         "properties": {
        #                             "start_date": {"type": "string"},
        #                             "end_date": {"type": "string"},
        #                             "current": {"type": "boolean", "enum": [False]},
        #                             "predicted": {"type": "boolean", "enum": [True]},
        #                             "created_at": {"type": "string"},
        #                         },
        #                         "required": ["start_date", "end_date", "current", "predicted", "created_at"],
        #                     },
        #                 }
        #             },
        #             "required": ["cycles"],
        #         },
        #     },
        #     )
        #     cycles = json.loads(interaction.output_text)["cycles"]
        #     for cycle in cycles:
        #         cycle_row = [
        #             cycle["start_date"],
        #             cycle["end_date"],
        #             cycle["current"],
        #             cycle["predicted"],
        #             cycle["created_at"],
        #         ]
        #         add_new_cycle(*cycle_row)
    rows = pull_data()


    
    return {"dates": rows}
