"""Dependency function to get a database session."""

from src.core.database import async_session_local


async def get_db():
    """Dependency function to get a database session."""
    db = async_session_local()
    try:
        yield db
    finally:
        await db.close()
