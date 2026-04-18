from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from uuid import UUID

class AddressCreate(BaseModel):
    address_line: str
    city: str
    state: str
    country: str
    postal_code: str = Field(..., min_length=3, max_length=20)
    is_default: Optional[bool] = False

class AddressResponse(BaseModel):
    id: UUID
    address_line: str
    city: str
    state: str
    country: str
    postal_code: str
    is_default: bool

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str]
    role: Optional[str]
    addresses: Optional[List[AddressCreate]]


class ProfileCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: Optional[str] = "customer"

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str

    class Config:
        from_attributes = True