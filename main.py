from dotenv import load_dotenv
from google import genai
from database_access import pull_data
load_dotenv()
client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input="Explain how AI works in a few words"
)

pull_data()
print(interaction.output_text)
