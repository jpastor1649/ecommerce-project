"""Schemas Pydantic para usuarios."""

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Datos para registrar un usuario."""

    email: EmailStr
    full_name: str
    password: str


class UserResponse(BaseModel):
    """Datos del usuario en respuestas."""

    id: int
    email: EmailStr
    full_name: str
    is_active: bool

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    """Datos para iniciar sesión."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Respuesta con token JWT."""

    access_token: str
    token_type: str = "bearer"
