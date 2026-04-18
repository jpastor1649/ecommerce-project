"""Products router for catalog browsing and filtering."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from product_service.core.dependencies.get_db import get_db
from product_service.core.dependencies.get_current_user import (
    AuthenticatedUser,
    get_current_user,
)
from product_service.services.product_service import ProductService
from product_service.schemas.product import CategoryResponse, ProductResponse

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[ProductResponse])
async def get_products(
    category_slug: str | None = Query(None, description="Filtrar por categoría"),
    _: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return product catalog, optionally filtered by category slug."""
    service = ProductService(db)
    return await service.get_all_products(category_slug)


@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(
    _: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all active categories."""
    service = ProductService(db)
    return await service.get_all_categories()


@router.get("/search", response_model=list[ProductResponse])
async def search_products(
    q: str = Query(
        ...,
        min_length=1,
        max_length=100,
        description="Search query (name or description)",
    ),
    category_slug: str | None = Query(None, description="Optional category filter"),
    _: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Search products by name or description (case-insensitive).

    Args:
        q: Search query string (minimum 1 character).
        category_slug: Optional category slug to filter results.
        _: Current authenticated user (required).
        db: Database session dependency.

    Returns:
        List of ProductResponse objects matching the search query.

    Example:
        GET /products/search?q=usb
        GET /products/search?q=usb&category_slug=electronics
        Returns all products with "usb" in name or description
    """
    service = ProductService(db)
    return await service.search_products(q, category_slug)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: UUID,
    _: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return a product by its ID."""
    service = ProductService(db)
    product = await service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product
