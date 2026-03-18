"""Authentication service for user login and token generation."""

import bcrypt
from fastapi import HTTPException, status
from sqlalchemy import select
from jose import jwt
from datetime import datetime, timedelta, timezone

from src.models.user import User
from src.core.config.settings import settings


async def auth_user(email: str, password: str, db):
    """
    Authenticates user credentials and generates JWT token.

    Args:
        email: User email for lookup in database.
        password: Plain text password to verify against hash.
        db: Database session dependency.

    Returns:
        dict: Contains access_token and token_type (bearer).

    Raises:
        HTTPException: 401 if user not found or password is incorrect.
    """
    # Authentication logic goes here
    select_user = await db.execute(select(User).where(User.email == email))
    user = select_user.scalars().first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    # Verify password using bcrypt
    if not bcrypt.checkpw(password.encode(), user.hashed_password.encode()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    # Generate and return token
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": str(user.id),
        "iat": now,
        "exp": expire,
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return {"access_token": token, "token_type": "bearer"}
