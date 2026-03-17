"""Schemas for user registration and response."""

import uuid

from pydantic import BaseModel


class UserRegister(BaseModel):
    """Schema for user registration."""

    full_name: str
    password: str
    email: str


class UserResponse(BaseModel):
    """Schema for user response."""

    id: uuid.UUID
    full_name: str
    email: str

    class Config:
        """Pydantic configuration to allow population by field name."""

        from_attributes = True
