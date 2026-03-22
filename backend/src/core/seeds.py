"""Database seeding utilities for initial product and category data.

This module provides functions to populate the database with sample data
on application startup. Seeds are idempotent (safe to run multiple times).
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal

from src.models.product import Category, Product


async def seed_initial_data(db: AsyncSession) -> None:
    """
    Seed initial products and categories if database is empty.

    This function creates sample products and categories for demonstration
    purposes if the database doesn't have any products yet. It's safe to
    run multiple times as it checks for existing data.

    Args:
        db: Async database session.

    Returns:
        None.

    Note:
        - This is temporary seeding for P1. Replace with Alembic migrations
          and dedicated admin endpoints (POST /products) in Phase 2+.
        - Idempotent: Running multiple times won't create duplicates.
    """
    # Check if products already exist
    result = await db.execute(select(Product))
    if result.scalars().first():
        return  # Products already seeded, skip

    # Create Categories
    category_data = [
        {
            "name": "Electronics",
            "slug": "electronics",
            "description": "Electronic devices and gadgets for modern life",
            "image_url": "https://via.placeholder.com/300x200?text=Electronics",
            "is_active": True,
        },
        {
            "name": "Clothing",
            "slug": "clothing",
            "description": "Apparel and fashion items for all seasons",
            "image_url": "https://via.placeholder.com/300x200?text=Clothing",
            "is_active": True,
        },
        {
            "name": "Home & Garden",
            "slug": "home-garden",
            "description": "Furniture and decoration for your home",
            "image_url": "https://via.placeholder.com/300x200?text=Home",
            "is_active": True,
        },
    ]

    slugs = [c["slug"] for c in category_data]
    result = await db.execute(select(Category).where(Category.slug.in_(slugs)))
    existing_categories = {c.slug: c for c in result.scalars().all()}
    categories = {}
    for data in category_data:
        slug = data["slug"]

        if slug in existing_categories:
            categories[slug] = existing_categories[slug]
        else:
            category = Category(**data)
            db.add(category)
            categories[slug] = category

    await db.flush()

    # Create products
    products = [
        # Electronics
        Product(
            category_id=categories["electronics"].id,
            name="Wireless Bluetooth Headphones",
            slug="wireless-bluetooth-headphones",
            description="High-quality Bluetooth headphones with active noise cancellation, "
            "30-hour battery life, and premium sound quality.",
            price=Decimal("149.99"),
            stock=25,
            is_active=True,
        ),
        Product(
            category_id=categories["electronics"].id,
            name="USB-C Fast Charging Cable",
            slug="usb-c-fast-charging-cable",
            description="Durable 2-meter USB-C cable supporting fast charging (65W) and high-speed data transfer rates.",
            price=Decimal("14.99"),
            stock=100,
            is_active=True,
        ),
        Product(
            category_id=categories["electronics"].id,
            name="Portable Power Bank 20000mAh",
            slug="portable-power-bank-20000mah",
            description="Compact power bank with dual USB ports, 20000mAh capacity, LED display, and fast charging support.",
            price=Decimal("39.99"),
            stock=50,
            is_active=True,
        ),
        # Clothing
        Product(
            category_id=categories["clothing"].id,
            name="100% Cotton Premium T-Shirt",
            slug="cotton-premium-tshirt",
            description="Comfortable and breathable 100% cotton t-shirt, "
            "available in multiple colors and sizes for all body types.",
            price=Decimal("29.99"),
            stock=50,
            is_active=True,
        ),
        Product(
            category_id=categories["clothing"].id,
            name="Classic Blue Denim Jeans",
            slug="classic-blue-denim-jeans",
            description="Timeless blue denim jeans with regular fit, perfect for casual or smart-casual occasions.",
            price=Decimal("79.99"),
            stock=30,
            is_active=True,
        ),
        Product(
            category_id=categories["clothing"].id,
            name="Casual Sports Running Shoes",
            slug="casual-sports-running-shoes",
            description="Lightweight and comfortable running shoes with anti-slip soles "
            "and breathable material for daily wear.",
            price=Decimal("89.99"),
            stock=40,
            is_active=True,
        ),
        # Home & Garden
        Product(
            category_id=categories["home-garden"].id,
            name="Adjustable Aluminum Phone Stand",
            slug="adjustable-aluminum-phone-stand",
            description="Premium aluminum phone stand for desk or table, "
            "adjustable to any angle, compatible with all phones and tablets.",
            price=Decimal("19.99"),
            stock=60,
            is_active=True,
        ),
        Product(
            category_id=categories["home-garden"].id,
            name="LED Desk Lamp with USB Charging",
            slug="led-desk-lamp-usb-charging",
            description="Modern LED desk lamp with adjustable brightness, color temperature control, and built-in USB charging port.",
            price=Decimal("45.99"),
            stock=35,
            is_active=True,
        ),
        Product(
            category_id=categories["home-garden"].id,
            name="Wooden Desk Organizer Set",
            slug="wooden-desk-organizer-set",
            description="Eco-friendly wooden desk organizer with multiple compartments for pens, papers, and office supplies.",
            price=Decimal("34.99"),
            stock=45,
            is_active=True,
        ),
    ]

    db.add_all(products)
    await db.commit()


# FUTURE: Admin Endpoint for Adding Products (Phase 2+)
# ====================================================
#
# POST /api/v1/admin/products
# Requires: Authentication + Admin Role
#
# Request:
# {
#   "name": "Product Name",
#   "slug": "product-slug",
#   "description": "Product description",
#   "price": 99.99,
#   "stock": 50,
#   "category_id": "uuid-here",
#   "image_url": "https://example.com/image.jpg",
#   "is_active": true
# }
#
# Response: 201 Created
# {
#   "id": "uuid",
#   "name": "Product Name",
#   "price": 99.99,
#   "stock": 50,
#   "category_id": "uuid",
#   "created_at": "2026-03-18T10:00:00Z"
# }
#
# Implementation Steps:
# 1. Create AdminUserRole enum (admin, moderator, user)
# 2. Add role field to User model
# 3. Create admin middleware to verify JWT + role
# 4. Create ProductAdminService with create/update/delete/archive operations
# 5. Create admin router with protection middleware
# 6. Add audit logging for admin actions
