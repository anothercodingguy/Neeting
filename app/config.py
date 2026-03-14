from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Meeting Notes Generator"
    ENVIRONMENT: str = "production"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/meeting_notes"
    
    # Security
    JWT_SECRET: str = "supersecretkey_please_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    # Groq API
    GROQ_API_KEY: Optional[str] = None
    
    # ChromaDB
    CHROMADB_DIR: str = "./chroma_db"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
