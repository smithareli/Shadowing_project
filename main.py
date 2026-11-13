import json
from dotenv import load_dotenv
from datetime import date, datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse

from pydantic import BaseModel, model_validator
from database_access import (
    pull_data, pull_history, check_cycle, check_daily_insight, get_daily_insight,
    replace_current_cycle, delete_todays_insight, get_tasks, add_task
)
from gemini_calls import predict_next_cycles, predict_daily_insights
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from calendar_access import get_calendar_events

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
    tasks = get_tasks()
    return {"cycles": cycles, "phase": insights[0]["phase"] if insights else None, "tasks": tasks}
class CurrentCycleIn(BaseModel):
    dates: list[date]
@app.put("/current-cycle")
def update_current_cycle(body: CurrentCycleIn):
    if not body.dates:
        raise HTTPException(status_code=400, detail="Select at least one date")
    replace_current_cycle(min(body.dates), max(body.dates))
    delete_todays_insight()
    return build_response()

class TaskIn(BaseModel):
    name: str
    description: str = ""
    location: str | None = None
    start_date: date
    end_date: date
    start_time: datetime
    end_time: datetime

    @model_validator(mode="after")
    def check_order(self):
        if self.end_time < self.start_time:
            raise ValueError("end_time must be after start_time")
        return self

@app.post("/add-task")
def add_task_route(body: TaskIn):
    add_task(
        task_name=body.name,
        task_description=body.description,
        task_location=body.location,
        task_start_date=body.start_date,
        task_end_date=body.end_date,
        task_start_time=body.start_time,
        task_end_time=body.end_time,
    )
    return build_response()


@app.get("/")
def get_data():
    return build_response()

@app.get("/google-calendar-events")
def get_google_calendar_events():
    events = get_calendar_events()
    return {"events": events}, build_response()

@app.get("/privacy", response_class=HTMLResponse)
def privacy():
    return """
    <h1>Berrie Privacy Policy</h1>
    <p>Berrie is a student project. It reads Google Calendar events (read-only)
    to show a user's daily schedule. Calendar data is not stored, sold, or shared.
    Contact: areli.m.s.365@gmail.com</p>
    """