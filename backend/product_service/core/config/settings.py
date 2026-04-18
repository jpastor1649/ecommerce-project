"""Product service settings loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Runtime settings for product_service."""

    database_url: str
    app_name: str = "Product Service"
    debug: bool = False
    jwt_secret: str = "change-this-secret"
    jwt_algorithm: str = "HS256"

    class Config:
        """Pydantic settings source configuration."""

        env_file = ".env"


settings = Settings()
