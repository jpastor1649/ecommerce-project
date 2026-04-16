from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .db import SessionLocal
from .services import UserService
from .schemas import UserCreate, AddressCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.create_user(user)

@router.get("/users/{user_id}")
def get_user(user_id: str, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user(user_id)

@router.post("/users/{user_id}/addresses")
def add_address(user_id: str, address: AddressCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.add_address(user_id, address)

@router.get("/users/{user_id}/addresses")
def get_user_addresses(user_id: str, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_addresses(user_id)