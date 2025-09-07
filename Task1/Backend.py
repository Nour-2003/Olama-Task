from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware

# client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

app = FastAPI()

# CORS setup (important for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"message": "Testing The Backend Server"}

@app.post("/chat")
def chat(request: ChatRequest):
    client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
    response = client.chat.completions.create(
        model="gemma3:4b",  # Make sure this model is installed with "ollama run llama3"
        messages=[
            {"role": "user", "content": request.message}
        ]
    )
    reply = response.choices[0].message.content
    return {"response": reply}
