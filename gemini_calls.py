import json

from dotenv import load_dotenv
from google import genai

from database_access import add_new_cycle, pull_data, add_daily_insight
load_dotenv()

client = genai.Client()
def predict_next_cycles(rows, predicted):
    interaction = client.interactions.create(
                model="gemini-3.8-flash",
                input="Predict the next " + str(predicted) + " cycles using this data: " + str(rows),
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
        cycle_row = [
            cycle["start_date"],
            cycle["end_date"],
            cycle["current"],
            cycle["predicted"],
            cycle["created_at"],
            ]
        add_new_cycle(*cycle_row)
    rows = pull_data()
    return rows
def predict_daily_insights(rows):
    interaction = client.interactions.create(
                model="gemini-3.8-flash",
                input=(
                    f"Predict the next daily insights using this data: {rows}\n"
                    "For the daily insight, phase refers to the current phase in the menstrual cycle.\n"
                    "Symptoms should be a list of 3 symptoms associated with that phase.\n"
                    "Tips should be a list of 4 tips associated with that phase."
                ),
                response_format={
                    "type": "text",
                    "mime_type": "application/json",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "insights": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "phase": {"type": "string"},
                                        "created_at": {"type": "string"},
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
                                    "required": ["phase", "created_at", "symptoms", "tips"]
                                },
                            }
                        },
                        "required": ["insights"],
                    },
                },
            )
    daily_insight = json.loads(interaction.output_text)
    for insight in daily_insight["insights"]:
        add_daily_insight(
            phase=insight["phase"],
            created_at=insight["created_at"],
            symptom=insight["symptoms"],
            Tips=insight["tips"],
        )
    return "success"