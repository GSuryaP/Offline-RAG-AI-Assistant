from fastapi import FastAPI
from pydantic import BaseModel
from app.rag_engine import initialize, get_answer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TopicRequest(BaseModel):
    topics: list[str]

class QueryRequest(BaseModel):
    question: str

@app.post("/init")
def init(req: TopicRequest):
    clean_topics = [t.strip() for t in req.topics]
    initialize(clean_topics)
    return {"message": "Knowledge base initialized"}

@app.post("/ask")
def ask(req: QueryRequest):
    answer = get_answer(req.question)
    return {"answer": answer}
