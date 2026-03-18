"""Main application entry point for the FastAPI backend.

Configures FastAPI application with middleware, routers, and lifecycle management.
Handles database initialization on startup and cleanup on shutdown.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config.settings import settings
from src.core.database import engine
from src.models.base import Base
from src.routers.auth import router as auth_router

# Import models to register them with Base.metadata
import src.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages application lifecycle events (startup and shutdown).

    Args:
        app: FastAPI application instance.

    Yields:
        None: Control returns to FastAPI framework.

    Note:
        - Startup: Creates database tables from SQLAlchemy models.
        - Shutdown: Disposes database engine and releases resources.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield  # App runs here

    # Clean up without blocking shutdown
    await engine.dispose()


app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],  # Cambia esto a los dominios permitidos en producción
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/health")
async def health_check():
    """Endpoint to check the health of the application.
    args:
    None
    Returns:
        dict: Status message indicating the application is healthy.
    """

    return {"status": "ok", "service": settings.app_name}
