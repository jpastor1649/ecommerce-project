from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config.settings import settings
from routers.auth import router as auth_router

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],  # Cambia esto a los dominios permitidos en producción
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": settings.app_name}
