"""Authentication dependency for protected product endpoints."""

import hashlib
from dataclasses import dataclass
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from product_service.core.config.settings import settings
from product_service.core.redis_client import get_redis_client

bearer_scheme = HTTPBearer(auto_error=False)


def _session_key(token: str) -> str:
    fingerprint = hashlib.sha256(token.encode("utf-8")).hexdigest()
    return f"{settings.auth_session_prefix}:{fingerprint}"


def _blacklist_key(token: str) -> str:
    fingerprint = hashlib.sha256(token.encode("utf-8")).hexdigest()
    return f"{settings.auth_blacklist_prefix}:{fingerprint}"


@dataclass(slots=True)
class AuthenticatedUser:
    """Minimal authenticated user payload resolved from JWT."""

    user_id: UUID
    role: str | None = None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> AuthenticatedUser:
    """Resolve and return authenticated user identity from Bearer token."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization token",
        )

    token = credentials.credentials

    redis_client = get_redis_client()
    if await redis_client.exists(_blacklist_key(token)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token revoked",
        )
    if settings.require_redis_session and not await redis_client.exists(_session_key(token)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired",
        )

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc

    user_id_raw = payload.get("sub")
    if not isinstance(user_id_raw, str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    try:
        user_id = UUID(user_id_raw)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        ) from exc

    role_raw = payload.get("role")
    role = role_raw if isinstance(role_raw, str) and role_raw.strip() else None
    return AuthenticatedUser(user_id=user_id, role=role)
