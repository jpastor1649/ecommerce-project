"""HTTP routes for authentication flows."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth_service.src.dependencies.get_current_user import get_current_user
from auth_service.src.dependencies.get_db import get_db
from auth_service.src.models.user import User
from auth_service.src.schemas.auth import TokenResponse, UserLogin
from auth_service.src.schemas.user import UserRegister, UserResponse
from auth_service.src.services.auth_service import (
    login_user,
    register_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_handler(
    payload: UserRegister,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Register a user with email/password credentials."""
    return await register_user(payload, db)


@router.post("/login", response_model=TokenResponse)
async def login_handler(
    payload: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """Authenticate user and return JWT token."""
    return await login_user(str(payload.email), payload.password, db)


@router.get("/me", response_model=UserResponse)
async def me_handler(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Return current authenticated user profile."""
    return UserResponse.model_validate(current_user)
