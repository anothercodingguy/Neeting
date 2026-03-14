from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeetingBase(BaseModel):
    title: str
    transcript: str

class MeetingCreate(MeetingBase):
    pass

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    transcript: Optional[str] = None

class MeetingResponse(MeetingBase):
    id: int
    user_id: int
    estimated_duration_minutes: Optional[float] = None
    speaker_count: Optional[int] = None
    transcript_length: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class MeetingAnalytics(BaseModel):
    transcript_length: int
    estimated_duration_minutes: float
    speaker_count: int
