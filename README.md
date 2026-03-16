# 🛒 E-commerce Inteligente — Grupo D

[![Lint](https://github.com/jpastor1649/ecommerce-project/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/jpastor1649/ecommerce-project/actions/workflows/lint.yml)
[![Tests](https://github.com/jpastor1649/ecommerce-project/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/jpastor1649/ecommerce-project/actions/workflows/test.yml)
[![Docker Build](https://github.com/jpastor1649/ecommerce-project/actions/workflows/docker.yml/badge.svg?branch=main)](https://github.com/jpastor1649/ecommerce-project/actions/workflows/docker.yml)
[![Python 3.12+](https://img.shields.io/badge/python-3.12%2B-blue.svg)](https://www.python.org/downloads/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Next.js%2014-3178C6.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cloud-DC382D.svg)](https://redis.io/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Flash-4285F4.svg)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Plataforma de comercio electrónico B2C inteligente para el mercado colombiano** que permite a los usuarios explorar un catálogo multi-categoría, gestionar un carrito de compras, completar compras con métodos de pago locales (PSE, Nequi, tarjetas) y recibir recomendaciones personalizadas a través de un asistente conversacional con IA generativa (Google Gemini Flash).

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Inicio Rápido](#-inicio-rápido)
- [Instalación Local](#-instalación-local)
- [Requerimientos](#-requerimientos)
- [Contribución](#-contribución)
- [Equipo](#-equipo)

---

## ✨ Características Principales

### 🛍️ E-commerce Core
- Registro e inicio de sesión de usuarios con JWT
- Catálogo de productos multi-categoría con filtros y búsqueda
- Carrito de compras persistente (Redis)
- Checkout completo con pasarela Wompi Colombia (PSE · Nequi · Tarjetas)
- Historial de órdenes y gestión de perfiles
- Reseñas y calificaciones de productos

### 🤖 IA Generativa (Google Gemini Flash)
- **Asistente conversacional**: chatbot que ayuda al usuario a encontrar productos y resolver dudas en lenguaje natural
- **Recomendaciones personalizadas**: sugerencias basadas en el historial del usuario y comportamiento de usuarios similares
- **Búsqueda semántica**: búsqueda vectorial con `pgvector` y embeddings (`text-embedding-004`)
- **Moderación automática**: revisión de reseñas con LLM — sin entrenamiento propio de modelos

### 🏗️ Arquitectura Distribuida (Clean Architecture)
- **`core-service`** (Python / FastAPI): autenticación, catálogo, carrito, órdenes, pagos, reseñas
- **`ai-service`** (Python / FastAPI): chatbot Gemini, recomendaciones, búsqueda semántica, moderación
- **`frontend`** (TypeScript / Next.js 14): BFF + UI — renderizado en servidor, sin exposición de URLs internas
- Dos bases de datos: PostgreSQL 15 + pgvector (relacional) y Redis Cloud (NoSQL clave-valor)

### 🔄 CI/CD Pipeline (GitHub Actions)
- ✅ **lint.yml**: Validación de código (Black, isort, Flake8 / ESLint)
- ✅ **test.yml**: Tests unitarios + cobertura ≥75%
- ✅ **docker.yml**: Build y validación de imágenes Docker

---

## 🏛️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN                                │
│  Next.js 14 App Router (BFF) — TypeScript                      │
│  Catálogo · Carrito · Checkout · Órdenes · Chatbot IA          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ ① REST JSON/HTTPS
          ┌────────────────┴───────────────┐
          ▼                                ▼
┌─────────────────┐              ┌──────────────────┐
│  core-service   │──② httpx ──▶│   ai-service     │
│  Python / FastAPI│              │  Python / FastAPI │
│  Auth · Productos│              │  Gemini · Recomen.│
│  Órdenes · Pagos │              │  Búsq. Semántica  │
└────────┬────────┘              └────────┬─────────┘
         │                                │
    ┌────┴────────────────────────────────┘
    ▼                  ▼
┌──────────────┐  ┌──────────────┐
│ PostgreSQL 15 │  │ Redis Cloud  │
│ + pgvector   │  │ (NoSQL cache)│
└──────────────┘  └──────────────┘
```

**Estilos arquitectónicos:**
- **Microservicios** — `core-service` y `ai-service` son desplegables independientes
- **Clean Architecture** — cada servicio sigue el modelo cebolla (Dominio → Aplicación → Infraestructura → Presentación)
- **BFF (Backend for Frontend)** — Next.js agrega respuestas de ambos servicios antes de renderizar
- **Patrones**: Repository, Dependency Injection, Strategy, Observer (Event Bus)

---

## 📁 Estructura del Proyecto

```
E-commerce/
│
├── README.md                          # Este archivo
├── LICENSE                            # MIT License
├── .gitignore
├── docker-compose.yml                 # Orquestación local completa
├── .env.example                       # Template de variables de entorno
│
├── .github/
│   └── workflows/
│       ├── lint.yml                   # ✅ Linting (Black, isort, Flake8 / ESLint)
│       ├── test.yml                   # ✅ Tests unitarios + cobertura ≥75%
│       └── docker.yml                 # ✅ Docker build validation
│
├── frontend/                          # Next.js 14 App Router
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app/                       # Rutas (App Router)
│       ├── components/                # Componentes reutilizables
│       └── lib/                       # API clients, hooks, utils
│
├── backend/                           # Microservicios Python
│   ├── core-service/                  # Auth, productos, órdenes, pagos
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── src/
│   │       ├── main.py
│   │       ├── routers/               # Endpoints FastAPI
│   │       ├── services/              # Casos de uso
│   │       ├── models/                # ORM SQLAlchemy
│   │       └── schemas/               # Pydantic v2
│   │
│   └── ai-service/                    # Gemini, recomendaciones, búsqueda
│       ├── Dockerfile
│       ├── requirements.txt
│       └── src/
│           ├── main.py
│           ├── routers/
│           ├── services/
│           └── adapters/              # GeminiAdapter, VectorRepository
│
└── docs/
    ├── entrega1.md                    # Primera entrega Arquisoft
    └── architecture/                  # Diagramas C4 (.puml) y C&C
        ├── C4_L1_SystemContext.puml
        ├── C4_L2_Container.puml
        ├── C4_L3_Component_CoreService.puml
        ├── C4_L3_Component_AIService.puml
        ├── CleanArchitecture.puml
        └── CC_View.puml
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Docker Desktop** instalado y en ejecución
- **Git**

### Con Docker Compose (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/jpastor1649/ecommerce-project.git
cd ecommerce-project

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves:
#   GEMINI_API_KEY=tu_clave_gemini
#   WOMPI_PUBLIC_KEY=tu_clave_wompi_publica
#   WOMPI_PRIVATE_KEY=tu_clave_wompi_privada

# 3. Levantar todos los servicios con un solo comando
docker compose up --build

# 4. Acceder a la aplicación
# Frontend:                   http://localhost:3000
# API core-service (Swagger):  http://localhost:8000/docs
# API ai-service  (Swagger):   http://localhost:8001/docs
```

**Servicios levantados:**

| Servicio | Puerto | Descripción |
|---|---|---|
| `frontend` | 3000 | Aplicación web Next.js |
| `core-service` | 8000 | API principal (auth, productos, órdenes) |
| `ai-service` | 8001 | API de IA (chatbot, recomendaciones) |
| `postgres` | 5432 | PostgreSQL 15 + pgvector |
| `redis` | 6379 | Redis — caché NoSQL |

```bash
# Para detener
docker compose down
```

---

## 💻 Instalación Local (Desarrollo)

### Backend — core-service

```bash
cd backend/core-service

python3.12 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env            # Completar variables

alembic upgrade head            # Ejecutar migraciones
uvicorn src.main:app --reload --port 8000
```

### Backend — ai-service

```bash
cd backend/ai-service

python3.12 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

uvicorn src.main:app --reload --port 8001
```

### Frontend

```bash
cd frontend

npm install
cp .env.example .env.local     # Completar variables

npm run dev                    # http://localhost:3000
```

---

## 📋 Requerimientos

### Requerimientos Funcionales

| ID | Descripción |
|---|---|
| RF-01 | Registro de usuarios, inicio de sesión y gestión de perfiles |
| RF-02 | Historial de compras y preferencias para personalización |
| RF-03 | Catálogo con búsqueda por nombre/categoría y filtros |
| RF-04 | Carrito de compras y proceso de checkout |
| RF-05 | Recomendaciones de productos mediante IA generativa |
| RF-06 | Reseñas y calificaciones de productos |
| RF-07 | Asistente conversacional IA para encontrar productos y recibir recomendaciones |

### Requerimientos No Funcionales

| ID | Descripción | Solución |
|---|---|---|
| RNF-01 | Disponibilidad — arquitectura resiliente a fallos | Microservicios independientes en contenedores |
| RNF-02 | Separación de responsabilidades por dominio | `core-service` y `ai-service` — dominios aislados |
| RNF-03 | IA generativa vía API externa sin entrenamiento propio | Google Gemini Flash API |
| RNF-04 | Catálogo categorizado | Tabla `categories` en PostgreSQL + filtros en frontend |
| RNF-05 | Despliegue local con un solo comando | `docker compose up --build` |
| RNF-06 | Al menos dos lenguajes de programación | Python 3.12 (FastAPI) + TypeScript (Next.js 14) |

---

## 🤝 Contribución

```bash
# 1. Crear rama desde develop
git checkout develop && git pull origin develop
git checkout -b feature/descripcion-corta

# 2. Hacer cambios y ejecutar tests
pytest backend/core-service/tests/ --cov=src --cov-fail-under=75

# 3. Commit con formato convencional
git commit -m "feat(products): add category filter endpoint"

# 4. Push y abrir Pull Request
git push -u origin feature/descripcion-corta
```

Los PRs deben pasar todos los status checks de CI antes de ser mergeados.

---

## 👥 Equipo

**Proyecto Académico — Arquisoft 2026**

| # | Nombre Completo |
|---|---|
| 1 | Sara Isabel Ospina Valderrama |
| 2 | Juan David Ruiz Guasca |
| 3 | Juan David Castañeda Cárdenas |
| 4 | John Alejandro Pastor Sandoval |
| 5 | Andrés Felipe Perdomo Uruburu |

---

## 📚 Documentación Adicional

- **[docs/entrega1.md](docs/entrega1.md)**: Documento de primera entrega — requisitos y arquitectura completa
- **[docs/architecture/](docs/architecture/)**: Diagramas C4 (PlantUML) y vista C&C
- **API Docs (local)**: [http://localhost:8000/docs](http://localhost:8000/docs) · [http://localhost:8001/docs](http://localhost:8001/docs)

---

## 📊 Estado del Proyecto

| Componente | Estado |
|---|---|
| CI/CD Pipeline | ![passing](https://img.shields.io/badge/status-en%20progreso-yellow) |
| core-service | ![wip](https://img.shields.io/badge/status-en%20progreso-yellow) |
| ai-service | ![wip](https://img.shields.io/badge/status-en%20progreso-yellow) |
| Frontend | ![wip](https://img.shields.io/badge/status-en%20progreso-yellow) |
| Diagramas arquitectónicos | ![done](https://img.shields.io/badge/status-completado-brightgreen) |
| Documento entrega1 | ![done](https://img.shields.io/badge/status-completado-brightgreen) |

---

## 📜 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**. Ver [LICENSE](LICENSE) para detalles.

---

<div align="center">
  <p>Construido con ❤️ por el Grupo D</p>
  <p>Arquitectura de Software — Arquisoft 2026</p>
</div>
