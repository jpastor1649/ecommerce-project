"""Products router for catalog browsing and filtering."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.dependencies.get_db import get_db
from src.models.product import Category, Product
from src.schemas.product import CategoryResponse, ProductResponse

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[ProductResponse])
async def get_products(
    category_slug: str | None = Query(None, description="Filtrar por categoría"),
    db: AsyncSession = Depends(get_db),
):
    """Return product catalog, optionally filtered by category slug."""
    query = select(Product).where(Product.is_active.is_(True))
    if category_slug:
        query = query.join(Category).where(Category.slug == category_slug)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Return all active categories."""
    result = await db.execute(select(Category).where(Category.is_active.is_(True)))
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: UUID, db: AsyncSession = Depends(get_db)):
    """Return a product by its ID."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product
