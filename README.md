# AI Meeting Notes Generator

Production-ready backend API for uploading meeting transcripts, managing meetings, generating AI-powered insights, and chatting with meeting context using RAG.

## Tech Stack
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **Vector DB**: ChromaDB (Embedded - Default `all-MiniLM-L6-v2`)
- **LLM**: Groq API (`llama3-70b-8192`)
- **Authentication**: JWT & password hashing (pbkdf2)
- **Testing**: Pytest

## Architecture Overview
The application follows a clean, modular structure:
- `app/models/`: SQLAlchemy DB models
- `app/schemas/`: Pydantic validation schemas
- `app/routes/`: FastAPI endpoint routers
- `app/services/`: Business logic for CRUD and analytics
- `app/ai/`: Wrappers for OpenAI LLM interaction and ChromaDB vector indexing.
- `app/utils/`: Security and dependency injection helpers.

When a meeting is created, its transcript is chunked and stored in ChromaDB for Retrieval-Augmented Generation (RAG) during chat queries.

## Setup Instructions

### Prerequisites
- Python 3.11+
- PostgreSQL
- Groq API Key

### 1. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```
Ensure you add a valid `GROQ_API_KEY` to your `.env` file.

### 2. Render Deployment
This project is configured for seamless deployment on Render using the included `render.yaml`.
1. Push this project to a GitHub repository.
2. Link the repository to your Render account as a Blueprint.
3. Render will provision the Web Service and apply variables (`GROQ_API_KEY`, etc.).
   
You can also run it via Docker locally using the `docker-compose.yml`.

### 3. Running Locally (Without Docker)
If you prefer to run the FastAPI app on your host machine:

1. Setup virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Start a PostgreSQL database and configure the `DATABASE_URL` in `.env`.

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

## Example API Requests

### 1. Register User
```bash
curl -X 'POST' \
  'http://localhost:8000/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "securepassword"
}'
```

### 2. Login (Get JWT Token)
```bash
curl -X 'POST' \
  'http://localhost:8000/auth/login' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=user@example.com&password=securepassword'
```

*Save the `access_token` from the response. Use it as an Authorization Bearer header for subsequent requests.*

### 3. Create a Meeting
```bash
curl -X 'POST' \
  'http://localhost:8000/meetings/' \
  -H 'Authorization: Bearer <YOUR_ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "Quarterly Engineering Sync",
  "transcript": "Alice: Let us discuss the new architecture.\nBob: I agree we should move to microservices.\nAlice: Good. Action item for Bob is to write the design doc."
}'
```

### 4. Generate AI Summary
```bash
curl -X 'POST' \
  'http://localhost:8000/meetings/1/generate-summary' \
  -H 'Authorization: Bearer <YOUR_ACCESS_TOKEN>'
```

### 5. Chat with your Meetings (RAG)
```bash
curl -X 'POST' \
  'http://localhost:8000/meetings/chat/' \
  -H 'Authorization: Bearer <YOUR_ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "Who is writing the design doc?"
}'
```


## AI Implementation Details
We replaced OpenAI with Groq. The `.env` variable `GROQ_API_KEY` facilitates connecting to the lightning-fast Groq APIs using the `llama3-70b-8192` language model. Document embeddings utilize ChromaDB's default local inference.

## Testing
Run the test suite using pytest. Set `GROQ_API_KEY="dummy"` to test standalone:
```bash
GROQ_API_KEY="dummy_key" PYTHONPATH=. pytest tests/
```
