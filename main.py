from dotenv import load_dotenv
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

@app.get("/")
def get_data():
    rows = pull_data()
    return {"dates": rows}
