from fastapi import FastAPI
from .db import Base, engine
from .events.user_profile_consumer import UserProfileEventConsumer
from .routes import router

app = FastAPI(title="User Service")
consumer = UserProfileEventConsumer()


@app.on_event("startup")
def on_startup() -> None:
    # Ensure local schema exists when service boots.
    Base.metadata.create_all(bind=engine)
    consumer.start()


@app.on_event("shutdown")
def on_shutdown() -> None:
    consumer.stop()


app.include_router(router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "user-service"}