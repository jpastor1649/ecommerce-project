"""Módulo principal de la API Ecommerce B2C Colombia."""

from fastapi import FastAPI

app = FastAPI(title="Ecommerce B2C Colombia", version="0.1.0")


@app.get("/")
def root():
    """Retorna el estado de la API."""
    return {"status": "ok", "message": "API funcionando"}


@app.get("/health")
def health():
    """Retorna el estado de salud del servicio."""
    return {"status": "healthy"}
