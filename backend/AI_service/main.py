"""FastAPI entrypoint for AI service MVP."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from AI_service.src.core.config import settings
from AI_service.src.routers.chat import router as chat_router


app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug,
    openapi_url=f"{settings.api_v1_prefix}/openapi.json",
    docs_url=f"{settings.api_v1_prefix}/docs",
    redoc_url=f"{settings.api_v1_prefix}/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Return service health status."""
    return {"status": "ok", "service": "ai-service"}