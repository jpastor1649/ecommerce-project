"""Application configuration settings."""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application configuration settings."""
    # Base de datos
    database_url: str

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    # Gemini
    gemini_api_key: str = ""

    # App
    app_name: str = "E-commerce API"
    debug: bool = False

    class Config:
        env_file = ".env"

settings = Settings()