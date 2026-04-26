"""AI Chat endpoint."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.deps import get_current_user
from auth.rbac import RBAC
from ai.engine import AIEngine

router = APIRouter(prefix="/chat", tags=["chat"])
ai_engine = AIEngine()

class ChatMessage(BaseModel):
    message: str
    context: dict = {}

@router.post("/query")
async def chat_query(req: ChatMessage, rbac: RBAC = Depends(get_current_user)):
    result = await ai_engine.process_query(
        message=req.message,
        context={**req.context, "role": rbac.role, "user_id": rbac.user_id},
    )
    return result
