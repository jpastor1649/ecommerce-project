"""Configuración de la conexión a PostgreSQL."""

import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://admin:password@postgres:5432/ecommerce",
)

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Base para todos los modelos ORM."""


async def get_db():
    """Dependencia que provee una sesión de base de datos."""
    async with AsyncSessionLocal() as session:
        yield session
