from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.schemas.ai import ChatRequest, ChatResponse
from app.utils.deps import get_current_user
from app.ai import vector_db, llm

router = APIRouter()

@router.post("/", response_model=ChatResponse)
def chat_about_meetings(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Retrieve relevant chunks for the user
        context = vector_db.search_meeting_context(query=request.query, user_id=current_user.id)
        
        if not context:
            return {"answer": "I don't have enough meeting context to answer that. Please upload some meetings first."}
            
        # 2. Answer using LLM with context
        answer = llm.answer_chat_query(query=request.query, retrieved_context=context)
        return {"answer": answer}
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while calling the chat service.")
