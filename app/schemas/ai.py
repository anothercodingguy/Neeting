from pydantic import BaseModel
from typing import List

class SummaryResponse(BaseModel):
    summary: str

class KeyPointsResponse(BaseModel):
    key_points: List[str]

class ActionItemsResponse(BaseModel):
    action_items: List[str]

class DecisionsResponse(BaseModel):
    decisions: List[str]

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
