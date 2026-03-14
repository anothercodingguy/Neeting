from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.config import settings

# Configure basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for uploading meeting transcripts and generating AI notes.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Meeting Notes Generator API", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "running"}

# Routers will be included here later
from app.routes import auth, meetings, ai, chat
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
app.include_router(ai.router, prefix="/meetings/{meeting_id}", tags=["ai"])
app.include_router(chat.router, prefix="/meetings/chat", tags=["chat"])
