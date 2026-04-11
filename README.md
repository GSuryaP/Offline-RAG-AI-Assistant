# Offline RAG AI Assistant

A Retrieval-Augmented Generation (RAG) based AI assistant that works fully offline using FAISS and FLAN-T5.

---

## Features

- Wikipedia-based knowledge retrieval
- FAISS vector similarity search
- Offline LLM using FLAN-T5 (no API required)
- Chat-style UI with left-right message alignment
- Fast and lightweight (CPU-friendly)
- No dependency on external APIs

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI (Python) |
| Embeddings | Sentence Transformers (`all-MiniLM-L6-v2`) |
| Vector DB | FAISS |
| Language Model | HuggingFace Transformers (`flan-t5-base`) |
| Frontend | HTML, CSS, JavaScript |
| Data Source | Wikipedia (via Python library) |

---

## System Architecture

```
User Query
    ↓
FAISS (semantic search)
    ↓
Top-k relevant Wikipedia chunks
    ↓
FLAN-T5 (generate answer)
    ↓
Final Response (UI)
```

---

## How It Works

1. User enters topics (e.g., *Artificial Intelligence*, *Mars*)
2. System retrieves relevant data from Wikipedia
3. Text is split into smaller chunks
4. Embeddings are generated using Sentence Transformers
5. Embeddings are stored in a FAISS vector database
6. On user query:
   - Relevant chunks are retrieved via similarity search
   - Chunks are passed to FLAN-T5 as context
   - Answer is generated and displayed in the chat UI

---

## UI Features

- Chat-style interface
- User messages displayed on the right
- AI responses displayed on the left
- Context and Answer shown separately
- Scrollable chat window

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/offline-rag-ai-assistant.git
cd offline-rag-ai-assistant
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the backend server

```bash
uvicorn app.main:app --reload
```

### 5. Open the frontend

```bash
xdg-open frontend/index.html
```

---

## Example Topics

Use full names for best results:

- `Artificial Intelligence`
    - What is artificial intelligence?
    - Who is the president of artificial intelligence in the year 2050 on mars?
    - What are the main applications of artificial intelligence?
    - What are the types of artificial intelligence?
    - Translate the term 'Artificial Intelligence' into Spanish.
- `Machine Learning`
    - What is machine learning?
    - What are different types of machine learning?
    - How does machine learning work?
    - What was the exact price of a machine learning textbook purchased by Abraham Lincoln?
    - Write a 4-line rhyming poem about how machine learning works.
- `Mars`
    - What is Mars?
    - Why is Mars called the red planet?
    - What are the main features of Mars?
    - What is the name of the alien mayor who currently governs Mars?
    - Name a popular 1990s Hollywood movie that features the planet Mars.
- `Operating System`
    - What is an operating system?
    - What are the functions of an operating system?
    - What are different types of operating systems?
    - How many dinosaurs used an Operating System during the Jurassic period?
    - In exactly three words, what is your personal opinion on the Windows Operating System?
- `Python (programming language)`
    - What is Python programming language?
    - What are the features of Python?
    - What is Python used for?
    - What is the exact geographic location and address of the snake that invented Python?
    - Provide a Python code snippet that prints 'Hello World'.

---

## Known Limitations

- FLAN-T5 is a lightweight model — responses may be less detailed
- Retrieval quality depends on Wikipedia content
- Some ambiguous topics may require manual handling

---

## Improvements Made

- Fixed Wikipedia API bug (`machine learning` query issue)
- Implemented fallback handling for unstable topics
- Added text chunking for better retrieval accuracy
- Improved prompt engineering for higher quality answers
- Designed a clean chat-based UI

---

## Key Design Decision

Switched from cloud APIs (Gemini) to an **offline FLAN-T5 model**:

- Avoids API rate limits
- Works without internet (after the first run)
- Stable for demos and evaluation

---

## Learning Outcomes

- RAG (Retrieval-Augmented Generation) architecture
- Vector similarity search using FAISS
- Text embeddings using Sentence Transformers
- Prompt engineering for generative models
- Full-stack AI application development

---

## Future Improvements

- Highlight relevant context words in responses
- Display similarity scores alongside results
- Persist FAISS index to disk
- Upgrade to a more capable local LLM (e.g., Mistral)
- Deploy as a public web app

---

## Author

**G Surya Prakash**
