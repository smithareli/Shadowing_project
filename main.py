import json
from dotenv import load_dotenv
from datetime import date
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database_access import (
    pull_data, pull_history, check_cycle, check_daily_insight, get_daily_insight,
    replace_current_cycle, delete_todays_insight,
)
from gemini_calls import predict_next_cycles, predict_daily_insights
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
def build_response():
    cycles = pull_data()
    needed = check_cycle()
    if needed > 0:
        predict_next_cycles(pull_history(), needed)
        cycles = pull_data()  

    if not check_daily_insight():
        predict_daily_insights(cycles)

    insights = get_daily_insight()
    return {"cycles": cycles, "phase": insights[0]["phase"] if insights else None}
class CurrentCycleIn(BaseModel):
    dates: list[date]
@app.put("/current-cycle")
def update_current_cycle(body: CurrentCycleIn):
    if not body.dates:
        raise HTTPException(status_code=400, detail="Select at least one date")
    replace_current_cycle(min(body.dates), max(body.dates))
    delete_todays_insight()
    return build_response()


@app.get("/")
def get_data():
    return build_response()