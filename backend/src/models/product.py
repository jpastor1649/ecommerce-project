"""Modelo ORM para productos."""

from sqlalchemy import Column, Float, Integer, String, Text
from src.database import Base


class Product(Base):
    """Tabla de productos del catálogo."""

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    stock = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
