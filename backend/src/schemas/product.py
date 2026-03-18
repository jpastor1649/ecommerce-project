"""Schemas Pydantic para productos."""

from pydantic import BaseModel


class ProductResponse(BaseModel):
    """Datos del producto en respuestas."""

    id: int
    name: str
    description: str | None
    price: float
    category: str
    stock: int
    image_url: str | None

    model_config = {"from_attributes": True}
