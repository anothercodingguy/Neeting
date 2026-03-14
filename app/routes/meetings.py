from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.meeting import MeetingCreate, MeetingResponse, MeetingAnalytics
from app.utils.deps import get_current_user
from app.services import meeting_service

router = APIRouter()

@router.post("/", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_new_meeting(
    meeting_in: MeetingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return meeting_service.create_meeting(db=db, meeting_in=meeting_in, user_id=current_user.id)

@router.get("/", response_model=List[MeetingResponse])
def read_meetings(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search term for title or transcript"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meetings = meeting_service.get_meetings(db, user_id=current_user.id, skip=skip, limit=limit, search=search)
    return meetings

@router.get("/{meeting_id}", response_model=MeetingResponse)
def read_meeting(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meeting = meeting_service.get_meeting(db, meeting_id=meeting_id, user_id=current_user.id)
    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = meeting_service.delete_meeting(db, meeting_id=meeting_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return None

@router.get("/{meeting_id}/analytics", response_model=MeetingAnalytics)
def get_meeting_analytics(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meeting = meeting_service.get_meeting(db, meeting_id=meeting_id, user_id=current_user.id)
    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    return {
        "transcript_length": meeting.transcript_length or 0,
        "estimated_duration_minutes": meeting.estimated_duration_minutes or 0.0,
        "speaker_count": meeting.speaker_count or 1
    }
