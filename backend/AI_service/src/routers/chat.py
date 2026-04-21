"""Chat router for AI service."""

from fastapi import APIRouter, HTTPException

from AI_service.src.schemas.chat import ChatRequest, ChatResponse
from AI_service.src.services.Ai_service import AiService

router = APIRouter(prefix="/chat", tags=["chat"])
ai_service = AiService()


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    user_message = request.message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Mensaje vacío")
    respuesta = ai_service.get_response(user_message)
    return ChatResponse(response=respuesta)