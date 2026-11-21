import json
from dotenv import load_dotenv
from datetime import date, datetime
from fastapi import FastAPI, HTTPException, Request, Header, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
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
def build_response(user_id):
    cycles = pull_data(user_id)
    history= pull_history(user_id)
    needed = check_cycle(user_id)
    if needed > 0 and history:
        predict_next_cycles(history, needed, user_id)
        cycles = pull_data(user_id)  

    if cycles and not check_daily_insight(user_id):
        predict_daily_insights(cycles, user_id)

    insights = get_daily_insight(user_id)
    tasks = get_tasks(user_id)
    return {"cycles": cycles, "phase": insights[0]["phase"] if insights else None, "tasks": tasks}

class CurrentCycleIn(BaseModel):
    dates: list[date]

def current_user_id(x_user_id: str=Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Not signed in")
    return x_user_id
@app.put("/current-cycle")
def update_current_cycle(body: CurrentCycleIn, user_id: str = Depends(current_user_id)):
    if not body.dates:
        raise HTTPException(status_code=400, detail="Select at least one date")
    replace_current_cycle(min(body.dates), max(body.dates), user_id)
    delete_todays_insight(user_id)
    return build_response(user_id)

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
def add_task_route(body: TaskIn, user_id: str = Depends(current_user_id)):
    add_task(
        task_name=body.name,
        task_description=body.description,
        task_location=body.location,
        task_start_date=body.start_date,
        task_end_date=body.end_date,
        task_start_time=body.start_time,
        task_end_time=body.end_time,
        user_id=user_id,
        
    )
    return build_response(user_id)


@app.get("/")
def get_data(user_id: str = Depends(current_user_id)):
    return build_response(user_id)

@app.get("/google-calendar-events")
def get_google_calendar_events(user_id: str = Depends(current_user_id)):
    events = get_calendar_events(user_id)
    return build_response(user_id)

@app.get("/privacy", response_class=HTMLResponse)
def privacy():
    return """
    <h1>Berrie Privacy Policy</h1>
    <p>Berrie is a student project. With the user's permission, it reads Google Calendar
    events (read-only) and saves their title, description, location, and times in the
    app's database so they can be shown alongside the user's tasks. This data is used only
    within the app and is not sold or shared. Contact: areli.m.s.365@gmail.com</p>
    """



@app.get("/auth/callback")
async def auth_callback(request: Request, redirect_uri: str = "myapp://home"):
    query_string = request.url.query
    target_url = f"{redirect_uri}?{query_string}" if query_string else redirect_uri
    return RedirectResponse(url=target_url)

@app.get("/auth-complete", response_class=HTMLResponse)
def auth_complete():
    return """
    <html><body style="font-family:sans-serif;text-align:center;padding:40px">
      <h2>Email verified!</h2>
      <p>Returning to Berrie...</p>
      <script>window.location.href = "berrie://home";</script>
      <p><a href="berrie://profile">Tap here if the app doesn't open</a></p>
    </body></html>
    """