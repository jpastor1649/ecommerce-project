"""Schemas for authentication-related operations."""

from pydantic import BaseModel


class UserLogin(BaseModel):
    """Schema for user login."""

    email: str
    password: str


class TokenResponse(BaseModel):
    """Schema for token response."""

    access_token: str
    token_type: str = "bearer"
