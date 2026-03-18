"""Script para poblar la base de datos con productos de prueba."""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import AsyncSessionLocal, engine, Base
from src.models.product import Product


async def seed():
    """Inserta productos de prueba en la base de datos."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        products = [
            Product(
                name="Camiseta Básica Blanca",
                description="Camiseta de algodón 100%",
                price=35000,
                category="Ropa",
                stock=50,
                image_url=None,
            ),
            Product(
                name="Jean Slim Azul",
                description="Jean slim fit talla 32",
                price=89000,
                category="Ropa",
                stock=30,
                image_url=None,
            ),
            Product(
                name="Tenis Nike Air",
                description="Tenis deportivos blancos",
                price=250000,
                category="Calzado",
                stock=20,
                image_url=None,
            ),
            Product(
                name="Mochila Negra",
                description="Mochila resistente 20L",
                price=75000,
                category="Accesorios",
                stock=15,
                image_url=None,
            ),
            Product(
                name="Audífonos Bluetooth",
                description="Audífonos inalámbricos con cancelación de ruido",
                price=180000,
                category="Tecnología",
                stock=10,
                image_url=None,
            ),
            Product(
                name="Reloj Casual",
                description="Reloj análogo correa de cuero",
                price=120000,
                category="Accesorios",
                stock=25,
                image_url=None,
            ),
        ]
        db.add_all(products)
        await db.commit()
        print("✅ Productos insertados correctamente")


if __name__ == "__main__":
    asyncio.run(seed())
