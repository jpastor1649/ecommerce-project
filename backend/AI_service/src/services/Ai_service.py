"""Minimal AI service wrapper over Groq chat completion."""

import importlib
from typing import Any

from AI_service.src.core.config import settings


class AiService:
    """Simple chat assistant service for MVP usage."""

    def __init__(self):
        self.model = settings.ai_model
        self.system_prompt = (
            "Eres un asistente virtual para un e-commerce. "
            "Tienes acceso a la lista de productos reales de la tienda. "
            "Cuando te pregunten por productos, busca en la información que se te provee "
            "y responde con detalles como nombre, precio, disponibilidad y descripción. "
            "Responde en el mismo idioma del usuario, sé breve y amable."
        )

        api_key = settings.resolved_api_key
        self.client: Any | None = self._build_client(api_key) if api_key else None

    @staticmethod
    def _build_client(api_key: str) -> Any | None:
        """Build Groq client lazily to avoid hard import failures in local envs."""
        try:
            groq_module = importlib.import_module("groq")
            groq_cls = getattr(groq_module, "Groq")
            return groq_cls(api_key=api_key)
        except Exception:
            return None

    def get_response(self, user_message: str) -> str:
        """Generate a single assistant response from a user message."""
        if not user_message.strip():
            return "Escribe un mensaje para poder ayudarte."

        if self.client is None:
            return (
                "AI service activo, pero sin API key configurada. "
                "Define AI_API_KEY en el entorno para habilitar respuestas del modelo."
            )

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_message},
                ],
                temperature=0.4,
                max_tokens=300,
                stream=False,
            )
            content = completion.choices[0].message.content if completion.choices else None
            if isinstance(content, str) and content.strip():
                return content.strip()
            return "No obtuve contenido del modelo. Intenta de nuevo."
        except Exception:
            return "No pude procesar tu consulta en este momento."