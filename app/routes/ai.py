from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.ai import SummaryResponse, KeyPointsResponse, ActionItemsResponse, DecisionsResponse
from app.utils.deps import get_current_user
from app.services.meeting_service import get_meeting
from app.ai import llm

router = APIRouter()

def _get_meeting_transcript(meeting_id: int, db: Session, user_id: int) -> str:
    meeting = get_meeting(db, meeting_id, user_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting.transcript

@router.post("/generate-summary", response_model=SummaryResponse)
def generate_summary(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transcript = _get_meeting_transcript(meeting_id, db, current_user.id)
    summary = llm.get_meeting_summary(transcript)
    return {"summary": summary}

@router.post("/generate-actions", response_model=ActionItemsResponse)
def generate_actions(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transcript = _get_meeting_transcript(meeting_id, db, current_user.id)
    actions = llm.get_action_items(transcript)
    return {"action_items": actions}

@router.post("/generate-decisions", response_model=DecisionsResponse)
def generate_decisions(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transcript = _get_meeting_transcript(meeting_id, db, current_user.id)
    decisions = llm.get_decisions(transcript)
    return {"decisions": decisions}
