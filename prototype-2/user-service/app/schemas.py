from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class AddressCreate(BaseModel):
    address_line: str
    city: str
    state: str
    country: str
    postal_code: str = Field(..., min_length=3, max_length=20)
    is_default: Optional[bool] = False

class AddressResponse(BaseModel):
    id: str
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

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

    class Config:
        from_attributes = True