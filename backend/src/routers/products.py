"""Router del catálogo de productos."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.database import get_db
from src.models.product import Product
from src.schemas.product import ProductResponse

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[ProductResponse])
async def get_products(
    category: str | None = Query(None, description="Filtrar por categoría"),
    db: AsyncSession = Depends(get_db),
):
    """Retorna el catálogo de productos, opcionalmente filtrado por categoría."""
    query = select(Product)
    if category:
        query = query.where(Product.category == category)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    """Retorna un producto por su ID."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product
