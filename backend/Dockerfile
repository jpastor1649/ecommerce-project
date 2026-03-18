FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .

RUN pip install --upgrade pip && \
    pip install fastapi uvicorn[standard] pydantic[email] pydantic-settings \
    sqlalchemy asyncpg alembic redis python-jose[cryptography] \
    bcrypt python-multipart httpx resend supabase \
    python-slugify pillow google-generativeai email-validator

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
