from fastapi import FastAPI

app = FastAPI(
    title="Ecommerce B2C Colombia",
    version="0.1.0"
)

@app.get("/")
def root():
    return {"status": "ok", "message": "API funcionando"}

@app.get("/health")
def health():
    return {"status": "healthy"}
