import bcrypt
from fastapi import APIRouter, Depends

from schemas.auth import UserLogin, TokenResponse
from services.auth_service import auth_user
from schemas.user import UserRegister, UserResponse
from models.user import User
from core.dependencies.get_db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register_user(user: UserRegister, db=Depends(get_db)):
    """Endpoint to register a new user."""
    # Registration logic goes here
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    user_information = {
        "full_name": user.full_name,
        "email": user.email,
        "password_hash": password_hash,
    }
    new_user = User(**user_information)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return UserResponse.model_validate(new_user)

@router.post("/login")
async def login_user(credentials: UserLogin, db=Depends(get_db)):
    return await auth_user(credentials.email, credentials.password, db)