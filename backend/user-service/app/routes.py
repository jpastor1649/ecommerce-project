from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .db import SessionLocal
from .services import UserService
from .schemas import AddressCreate, AddressResponse, ProfileCreate, UserCreate, UserResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.create_user(user)

@router.post(
    "/internal/profiles",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.create_profile(profile)

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user(user_id)

@router.post(
    "/users/{user_id}/addresses",
    response_model=AddressResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_address(user_id: str, address: AddressCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.add_address(user_id, address)

@router.get("/users/{user_id}/addresses", response_model=list[AddressResponse])
def get_user_addresses(user_id: str, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_addresses(user_id)