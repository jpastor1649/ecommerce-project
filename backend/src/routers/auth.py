"""Authentication router for user registration and login."""

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError

from src.schemas.auth import UserLogin
from src.services.auth_service import auth_user
from src.schemas.user import UserRegister, UserResponse
from src.models.user import User
from src.core.dependencies.get_db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register_user(user: UserRegister, db=Depends(get_db)):
    """
    Endpoint to register a new user with email and password.

    Args:
        user: User registration data containing full_name, email, and password.
        db: Database session dependency.

    Returns:
        UserResponse: Created user data (id, full_name, email).

    Raises:
        HTTPException: 409 if email already exists.
    """
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode(
        "utf-8"
    )
    user_information = {
        "full_name": user.full_name,
        "email": user.email,
        "hashed_password": password_hash,
    }
    new_user = User(**user_information)
    db.add(new_user)
    try:
        await db.commit()
        await db.refresh(new_user)
    except IntegrityError as exc:  # if email already exists, rollback and raise 409
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        ) from exc
    return UserResponse.model_validate(
        new_user
    )  # Convert SQLAlchemy model to Pydantic response


@router.post("/login")
async def login_user(credentials: UserLogin, db=Depends(get_db)):
    """
    Authenticates a user and returns a JWT token.

    Args:
        credentials: User login data containing email and password.
        db: Database session dependency.

    Returns:
        dict: Contains access_token and token_type (bearer).

    Raises:
        HTTPException: 401 if credentials are invalid.
    """
    return await auth_user(credentials.email, credentials.password, db)
