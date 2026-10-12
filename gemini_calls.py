import json

from dotenv import load_dotenv
from google import genai

from database_access import add_new_cycle, pull_data
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
    cycles = json.loads(interaction.output_text)["cycles"]
    for cycle in cycles:
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