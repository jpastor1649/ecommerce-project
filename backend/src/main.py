"""Módulo principal de la API Ecommerce B2C Colombia."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.database import engine, Base
from src.routers import auth, products


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Crea las tablas en la base de datos al iniciar."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="Ecommerce B2C Colombia",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(auth.router)
app.include_router(products.router)


@app.get("/")
def root():
    """Retorna el estado de la API."""
    return {"status": "ok", "message": "API funcionando"}


@app.get("/health")
def health():
    """Retorna el estado de salud del servicio."""
    return {"status": "healthy"}
