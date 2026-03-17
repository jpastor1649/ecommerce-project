"""Authentication service for user login and token generation."""

import bcrypt
from fastapi import HTTPException, status
from sqlalchemy import select
from jose import jwt

from src.models.user import User
from src.core.config.settings import settings


async def auth_user(email: str, password: str, db):
    """Authenticate user and return a token."""
    # Authentication logic goes here
    select_user = await db.execute(select(User).where(User.email == email))
    user = select_user.scalars().first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    # Verify password using bcrypt
    if not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    # Generate and return token
    token = jwt.encode(
        {"sub": str(user.id)}, settings.jwt_secret, algorithm=settings.jwt_algorithm
    )
    return {"access_token": token, "token_type": "bearer"}
