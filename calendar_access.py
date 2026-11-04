import datetime
import os

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from database_access import get_current_date

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
def get_calendar_events():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(
                host="localhost",
                port=8000,
            )
        with open("token.json", "w", encoding="utf-8") as token:
            token.write(creds.to_json())

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