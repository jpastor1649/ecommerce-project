"""Modelo ORM para usuarios."""

from sqlalchemy import Boolean, Column, Integer, String
from src.database import Base


class User(Base):
    """Tabla de usuarios registrados."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
