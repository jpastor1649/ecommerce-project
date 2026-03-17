from core.database import AsyncSessionLocal


async def get_db():
    """Dependency function to get a database session."""
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()