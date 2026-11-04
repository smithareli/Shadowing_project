import datetime
import os

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from database_access import get_current_date

TOKEN_PATH = "/etc/secrets/token.json"
if not os.path.exists(TOKEN_PATH):
    TOKEN_PATH = "token.json"  # local development

def get_credentials():
    creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())  
        else:
            raise RuntimeError("Google token invalid; regenerate it locally.")
    return creds

def get_calendar_events():
    creds = get_credentials()
    try:
        target_date = get_current_date()
        start_of_day =f"{target_date}T00:00:00Z"
        end_of_day = f"{target_date}T23:59:59Z"
        service = build("calendar", "v3", credentials=creds)
        now = datetime.datetime.now(tz=datetime.timezone.utc).isoformat()
        events_result = service.events().list(
            calendarId="primary",
            timeMin=start_of_day,
            timeMax=end_of_day,
            maxResults=10,
            singleEvents=True,
            orderBy="startTime",
        ).execute()

        events = events_result.get("items", [])
        return events
    except HttpError as error:
        print(f"Calendar API request failed: {error}")
        return []