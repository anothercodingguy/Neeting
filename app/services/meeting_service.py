import re
from sqlalchemy.orm import Session
from typing import Optional
from app.models.meeting import Meeting
from app.schemas.meeting import MeetingCreate, MeetingUpdate
from app.ai import vector_db

def calculate_transcript_analytics(transcript: str) -> dict:
    # 1. Transcript length (words)
    words = len(transcript.split())
    
    # 2. Estimated duration (assume ~150 words per minute)
    duration_minutes = round(words / 150.0, 2) if words > 0 else 0.0
    
    # 3. Speaker count (basic heuristic: look for "Speaker X:", "Name:", etc.)
    # This is a simple regex to find patterns like "John Doe:" at the start of a line or paragraph
    speaker_pattern = re.compile(r'([A-Z][a-zA-Z\s]+):')
    speakers = set(speaker_pattern.findall(transcript))
    speaker_count = len(speakers) if speakers else 1 # default at least 1 speaker
    
    return {
        "transcript_length": words,
        "estimated_duration_minutes": duration_minutes,
        "speaker_count": speaker_count
    }

def create_meeting(db: Session, meeting_in: MeetingCreate, user_id: int) -> Meeting:
    analytics = calculate_transcript_analytics(meeting_in.transcript)
    
    meeting = Meeting(
        user_id=user_id,
        title=meeting_in.title,
        transcript=meeting_in.transcript,
        transcript_length=analytics["transcript_length"],
        estimated_duration_minutes=analytics["estimated_duration_minutes"],
        speaker_count=analytics["speaker_count"]
    )
    
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    # After saving to DB, index the transcript into ChromaDB
    try:
        vector_db.index_meeting_transcript(meeting_id=meeting.id, user_id=user_id, transcript=meeting.transcript)
    except Exception as e:
        print(f"Error indexing to ChromaDB: {e}")
        # Not failing the creation request, but log it.
        
    return meeting

def get_meetings(db: Session, user_id: int, skip: int = 0, limit: int = 100, search: str = None):
    query = db.query(Meeting).filter(Meeting.user_id == user_id)
    if search:
        query = query.filter(
            (Meeting.title.ilike(f"%{search}%")) | 
            (Meeting.transcript.ilike(f"%{search}%"))
        )
    return query.offset(skip).limit(limit).all()

def get_meeting(db: Session, meeting_id: int, user_id: int) -> Optional[Meeting]:
    return db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.user_id == user_id).first()

def delete_meeting(db: Session, meeting_id: int, user_id: int) -> bool:
    meeting = get_meeting(db, meeting_id, user_id)
    if meeting:
        db.delete(meeting)
        db.commit()
        return True
    return False
