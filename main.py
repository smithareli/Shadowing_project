from dotenv import load_dotenv
from google import genai
from database_access import pull_data
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
load_dotenv()
client = genai.Client()

#interaction = client.interactions.create(
    #model="gemini-3.8-flash",
    #input="Explain how AI works in a few words"
def get_data():
    # Call the pull_data function and store the result in a variable
    rows = pull_data()
    return {
        "status": "success",
        "dates" : rows
    }
get_data()
