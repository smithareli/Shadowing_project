import json

from dotenv import load_dotenv
from google import genai
from datetime import date, timedelta
from datetime import datetime
from zoneinfo import ZoneInfo
ET = ZoneInfo("America/New_York")

from database_access import add_new_cycle, pull_data, add_daily_insight, get_current_date
load_dotenv()

client = genai.Client()
def predict_next_cycles(rows, predicted, user_id):
    today = get_current_date()
    last_end = max((r["end_date"] for r in rows), default=today)
    interaction = client.interactions.create(
                model="gemini-3.8-flash",
                input=(
                    f"Today is {today}. Predict the next {predicted} menstrual cycles using this "
                    f"history: {rows}. Each predicted cycle must start after {last_end} and no "
                    f"earlier than {today}, and use the typical cycle and period length shown in the history."
                ),
                response_format={
                    "type": "text",
                    "mime_type": "application/json",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "cycles": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "start_date": {"type": "string"},
                                        "end_date": {"type": "string"},
                                        "current": {"type": "boolean", "enum": [False]},
                                        "predicted": {"type": "boolean", "enum": [True]},
                                        "created_at": {"type": "string"},
                                    },
                                    "required": ["start_date", "end_date", "current", "predicted", "created_at"],
                                },
                            }
                        },
                        "required": ["cycles"],
                    },
                },
            )
    payload = json.loads(interaction.output_text)

    for cycle in payload["cycles"]:
        start = date.fromisoformat(cycle["start_date"])
        end = date.fromisoformat(cycle["end_date"])
        if start <= last_end or start < today or end < start:
            continue
        add_new_cycle(cycle["start_date"], cycle["end_date"], False, True, None, user_id)
    return pull_data(user_id)
def predict_daily_insights(rows, user_id):
    insight_date = get_current_date()
    interaction = client.interactions.create(
                model="gemini-3.8-flash",
                input=(
                    f"Generate exactly one daily insight for {insight_date} using this data: {rows}\n"
                    "For the daily insight, phase refers to the current phase in the menstrual cycle.\n"
                    "Symptoms should be a list of 3 symptoms associated with that phase.\n"
                    "Tips should be a list of 4 tips associated with that phase.\n"
                    "Do not generate insights for any other date."
                ),
                response_format={
                    "type": "text",
                    "mime_type": "application/json",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "insight": {
                                "type": "object",
                                "properties": {
                                    "phase": {"type": "string"},
                                    "symptoms": {
                                        "type": "array",
                                        "items": {"type": "string"},
                                        "minItems": 3,
                                        "maxItems": 3,
                                    },
                                    "tips": {
                                        "type": "array",
                                        "items": {"type": "string"},
                                        "minItems": 4,
                                        "maxItems": 4,
                                    },
                                },
                                "required": ["phase", "symptoms", "tips"],
                            }
                        },
                        "required": ["insight"],
                    },
                },
            )
    daily_insight = json.loads(interaction.output_text)
    insight = daily_insight["insight"]
    add_daily_insight(
        phase=insight["phase"],
        user_id= user_id,
        symptom=insight["symptoms"],
        Tips=insight["tips"],
    )
    return "success"

