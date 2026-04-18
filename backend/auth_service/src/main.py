"""FastAPI entrypoint for auth_service container."""

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from auth_service.src.core.database import engine
from auth_service.src.models.base import Base
from auth_service.src.models.user import User  # noqa: F401
from auth_service.src.core.settings import settings
from auth_service.src.routers.auth import router as auth_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Initialize and close shared resources for auth_service."""
    max_attempts = 10
    for attempt in range(1, max_attempts + 1):
        try:
            async with engine.begin() as conn:
                await conn.execute(text("SELECT 1"))
                await conn.run_sync(Base.metadata.create_all)
            break
        except Exception:
            if attempt == max_attempts:
                raise
            await asyncio.sleep(2)

    yield

    await engine.dispose()


app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)
app.include_router(auth_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Return service health status."""
    return {"status": "ok", "service": "auth_service"}
