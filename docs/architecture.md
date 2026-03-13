# Arquitectura del Sistema — E-commerce Generalista Colombia

> **Patrón:** Monolito Modular + Clean Architecture + DDD Táctico  
> **Versión:** 1.0 | **Fecha:** 2026-03-13

---

## 1. Diagrama de Sistema (Vista General)

Muestra todos los componentes del sistema y cómo interactúan con los servicios externos.

```mermaid
graph TB
    subgraph USERS["👥 Actores"]
        V["🌐 Visitante<br/>(Browser)"]
        C["🛒 Cliente<br/>(Browser)"]
        A["⚙️ Admin<br/>(Browser)"]
    end

    subgraph FRONTEND["☁️ Vercel — Frontend (Next.js 14)"]
        FE_PUBLIC["📄 Páginas Públicas<br/>Home · Catálogo · Producto · Búsqueda"]
        FE_AUTH["🔐 Páginas Autenticadas<br/>Carrito · Checkout · Órdenes · Perfil"]
        FE_ADMIN["🛠️ Panel Admin<br/>Productos · Órdenes · Reseñas · Fraude"]
        FE_CHAT["💬 Widget Chatbot<br/>(SSE Streaming)"]
    end

    subgraph BACKEND["☁️ Koyeb — Backend (FastAPI + Python 3.12)"]
        direction TB

        subgraph PRESENTATION["presentation/ — FastAPI Routers"]
            R_AUTH["🔑 /auth"]
            R_PROD["📦 /products"]
            R_SRCH["🔍 /search"]
            R_CART["🛒 /cart"]
            R_ORD["📋 /orders"]
            R_PAY["💳 /payments"]
            R_REV["⭐ /reviews"]
            R_CHAT["💬 /chat"]
            R_ADMIN["🛠️ /admin"]
        end

        subgraph APPLICATION["application/ — Use Cases"]
            UC["AuthUseCase · ProductUseCase<br/>OrderUseCase · PaymentUseCase<br/>ReviewUseCase · ChatUseCase<br/>FraudUseCase · SearchUseCase"]
        end

        subgraph DOMAIN["domain/ — Entidades + Reglas de Negocio"]
            ENT["User · Product · Order<br/>Review · Payment · Cart"]
            VO["Money · Email · OrderStatus<br/>RiskScore · Sentiment"]
            REPO_I["IUserRepo · IProductRepo<br/>IOrderRepo · IReviewRepo"]
        end

        subgraph INFRASTRUCTURE["infrastructure/ — Adaptadores"]
            DB_ADAPTER["🐘 SQLAlchemy 2.0 async<br/>(PostgreSQL Repos)"]
            CACHE_ADAPTER["⚡ redis-py async<br/>(Cache + Sesiones)"]
            AI_ADAPTER["🤖 GeminiAdapter<br/>(LLM + Embeddings)"]
            PAY_ADAPTER["💰 WompiAdapter<br/>(Pagos Colombia)"]
            EMAIL_ADAPTER["📧 ResendAdapter<br/>(Emails transaccionales)"]
            STORAGE_ADAPTER["🗂️ SupabaseStorageAdapter<br/>(Imágenes)"]
        end
    end

    subgraph EXTERNAL["🌍 Servicios Externos (Free Tier)"]
        SUPABASE[("🐘 Supabase<br/>PostgreSQL 15 + pgvector<br/>500MB free")]
        REDIS[("⚡ Redis Cloud<br/>30MB free")]
        GEMINI["🤖 Google Gemini<br/>1.5 Flash + text-embedding-004<br/>1,500 req/día free"]
        WOMPI["💳 Wompi<br/>PSE · Nequi · Tarjetas<br/>Sandbox free"]
        RESEND["📧 Resend<br/>100 emails/día free"]
        SENTRY["🚨 Sentry<br/>Error tracking<br/>5K errors/mes free"]
        STORAGE[("🗂️ Supabase Storage<br/>1GB free")]
    end

    subgraph CICD["⚙️ GitHub Actions — CI/CD"]
        PIPELINE["lint → test → docker build → deploy"]
    end

    %% Usuario → Frontend
    V & C & A -->|HTTPS| FE_PUBLIC & FE_AUTH & FE_ADMIN

    %% Frontend → Backend
    FE_PUBLIC & FE_AUTH & FE_ADMIN & FE_CHAT -->|REST API / SSE| PRESENTATION

    %% Capas internas (dependencias hacia adentro)
    PRESENTATION --> APPLICATION
    APPLICATION --> DOMAIN
    APPLICATION --> INFRASTRUCTURE

    %% Infrastructure → Servicios externos
    DB_ADAPTER --> SUPABASE
    CACHE_ADAPTER --> REDIS
    AI_ADAPTER --> GEMINI
    PAY_ADAPTER --> WOMPI
    EMAIL_ADAPTER --> RESEND
    STORAGE_ADAPTER --> STORAGE

    %% Wompi webhook → Backend
    WOMPI -->|"Webhook HMAC-SHA256"| R_PAY

    %% Error tracking
    BACKEND -.->|"errores / excepciones"| SENTRY
    FRONTEND -.->|"errores JS"| SENTRY

    %% CI/CD
    CICD -->|deploy| FRONTEND
    CICD -->|deploy| BACKEND

    %% Estilos
    classDef external fill:#f0f0f0,stroke:#999,color:#333
    classDef frontend fill:#0070f3,stroke:#0050c3,color:#fff
    classDef backend fill:#009688,stroke:#00796b,color:#fff
    classDef domain fill:#ff6f00,stroke:#e65100,color:#fff
    classDef infra fill:#7b1fa2,stroke:#6a1b9a,color:#fff

    class SUPABASE,REDIS,GEMINI,WOMPI,RESEND,SENTRY,STORAGE external
    class FE_PUBLIC,FE_AUTH,FE_ADMIN,FE_CHAT frontend
    class R_AUTH,R_PROD,R_SRCH,R_CART,R_ORD,R_PAY,R_REV,R_CHAT,R_ADMIN backend
    class ENT,VO,REPO_I domain
    class DB_ADAPTER,CACHE_ADAPTER,AI_ADAPTER,PAY_ADAPTER,EMAIL_ADAPTER,STORAGE_ADAPTER infra
```

---

## 2. Arquitectura de Capas (Clean Architecture)

Muestra cómo se organiza el código internamente y la **Regla de Dependencia** (las flechas siempre apuntan hacia adentro).

```mermaid
graph LR
    subgraph OUTER["Capa Externa — Infraestructura"]
        direction TB
        DB["🐘 PostgreSQL<br/>SQLAlchemy repos"]
        CACHE["⚡ Redis<br/>redis-py"]
        LLM["🤖 Gemini API<br/>Function Calling"]
        PAY["💳 Wompi API"]
        EMAIL["📧 Resend API"]
        API["🌐 FastAPI<br/>HTTP / SSE / WebSocket"]
    end

    subgraph APP["Capa Aplicación — Use Cases"]
        UC1["CreateOrderUseCase"]
        UC2["SearchProductsUseCase"]
        UC3["ModerateReviewUseCase"]
        UC4["DetectFraudUseCase"]
        UC5["ChatWithAssistantUseCase"]
        UC6["AuthenticateUserUseCase"]
    end

    subgraph DOM["🔶 Capa Dominio — Núcleo (PURO)"]
        direction TB
        E["Entidades<br/>User · Product · Order<br/>Review · Payment"]
        VO_D["Value Objects<br/>Money(COP) · Email<br/>OrderStatus · RiskScore"]
        RULES["Reglas de Negocio<br/>orden.calcularTotal()<br/>fraude.evaluarRiesgo()<br/>resena.estaAprobada()"]
        PORTS["Puertos (interfaces)<br/>IProductRepository<br/>IOrderRepository<br/>IAIService<br/>IPaymentGateway"]
    end

    %% Dependencias (todas apuntan al dominio)
    API -->|"llama"| APP
    DB & CACHE & LLM & PAY & EMAIL -->|"implementan puertos"| PORTS
    APP -->|"usa entidades"| E & VO_D
    APP -->|"invoca reglas"| RULES
    APP -->|"depende de interfaces"| PORTS

    %% El dominio NO depende de nada externo
    DOM -.->|"❌ NUNCA importa"| OUTER

    note["💡 La capa Dominio no tiene<br/>ningún import externo.<br/>Solo Python puro."]

    classDef domain fill:#ff6f00,stroke:#e65100,color:#fff,font-weight:bold
    classDef app fill:#1565c0,stroke:#0d47a1,color:#fff
    classDef outer fill:#37474f,stroke:#263238,color:#fff

    class E,VO_D,RULES,PORTS domain
    class UC1,UC2,UC3,UC4,UC5,UC6 app
    class DB,CACHE,LLM,PAY,EMAIL,API outer
```

---

## 3. Flujo de Request — Búsqueda Semántica con IA

Muestra el ciclo de vida completo de una búsqueda desde el browser hasta la respuesta con resultados IA.

```mermaid
sequenceDiagram
    actor User as 👤 Usuario
    participant FE as Next.js Frontend
    participant API as FastAPI /search
    participant UC as SearchProductsUseCase
    participant GEMINI as Gemini API
    participant PG as PostgreSQL + pgvector
    participant REDIS as Redis Cache

    User->>FE: escribe "zapatos deportivos rojos talla 42"
    FE->>API: GET /search?q=zapatos+deportivos+rojos+talla+42

    API->>REDIS: ¿existe cache para esta query?
    alt Cache HIT (TTL: 2 min)
        REDIS-->>API: resultados cacheados
        API-->>FE: 200 OK (desde cache, ~5ms)
    else Cache MISS
        API->>UC: execute(query="zapatos deportivos rojos talla 42")

        UC->>GEMINI: embed("zapatos deportivos rojos talla 42")
        Note over GEMINI: text-embedding-004<br/>genera vector [0.12, -0.34, ...]
        GEMINI-->>UC: vector float[768]

        par Búsqueda en paralelo
            UC->>PG: SELECT ... ORDER BY embedding <=> $vector LIMIT 20
            Note over PG: Búsqueda vectorial<br/>(cosine similarity, IVFFlat index)
            PG-->>UC: top-20 semánticos
        and
            UC->>PG: SELECT ... WHERE to_tsvector @@ plainto_tsquery($query)
            Note over PG: Búsqueda full-text<br/>(PostgreSQL built-in)
            PG-->>UC: top-20 full-text
        end

        UC->>UC: RRF(semánticos, full-text)
        Note over UC: Reciprocal Rank Fusion<br/>combina ambos rankings<br/>score = 1/(k+rank_sem) + 1/(k+rank_ft)

        UC-->>API: top-10 productos fusionados
        API->>REDIS: SET cache[query_hash] = resultados (TTL: 2min)
        API-->>FE: 200 OK con productos rankeados (~350ms)
    end

    FE-->>User: muestra resultados con relevancia híbrida
```

---

## 4. Flujo de Orden Completa (Happy Path)

Muestra el flujo crítico: desde que el usuario hace checkout hasta que recibe confirmación de pago.

```mermaid
sequenceDiagram
    actor C as 🛒 Cliente
    participant FE as Next.js
    participant API as FastAPI
    participant FRAUD as FraudUseCase
    participant GEMINI as Gemini (Fraude)
    participant PG as PostgreSQL
    participant REDIS as Redis (Carrito)
    participant WOMPI as Wompi API
    participant EMAIL as Resend

    C->>FE: click "Pagar"
    FE->>API: POST /orders/checkout

    API->>REDIS: GET cart:{user_id}
    REDIS-->>API: items del carrito

    API->>PG: BEGIN TRANSACTION
    API->>PG: verificar stock (SELECT FOR UPDATE)

    alt Stock insuficiente
        API-->>FE: 409 Conflict "Sin stock"
    else Stock OK
        API->>PG: INSERT INTO orders (status=pending)
        API->>PG: UPDATE products SET stock = stock - qty (atómico)
        API->>PG: COMMIT

        API->>FRAUD: evaluar(order, user, ip)
        Note over FRAUD: Nivel 1: Reglas<br/>Nivel 2: Heurísticas<br/>Nivel 3: Gemini LLM
        FRAUD->>GEMINI: analizar contexto transaccional
        GEMINI-->>FRAUD: riesgo = 0.12 (bajo)
        FRAUD-->>API: score=0.12 → ALLOW

        API->>WOMPI: POST /transactions (referencia única)
        WOMPI-->>API: { payment_url, transaction_id }
        API-->>FE: 201 Created + payment_url

        FE->>C: redirige a pasarela Wompi
        C->>WOMPI: ingresa datos de pago (PSE/Nequi/Tarjeta)
        WOMPI-->>C: procesa pago

        WOMPI->>API: POST /payments/webhook
        Note over API: valida HMAC-SHA256<br/>del evento recibido
        API->>PG: UPDATE orders SET status='paid'
        API->>REDIS: DEL cart:{user_id}

        API->>EMAIL: send(orden_confirmada, cliente@email.com)
        EMAIL-->>C: 📧 "Tu orden fue confirmada"
        API-->>WOMPI: 200 OK (webhook procesado)
    end
```

---

## 5. Pipeline CI/CD

Muestra qué sucede automáticamente cada vez que haces `git push` a `main`.

```mermaid
graph LR
    DEV["👨‍💻 Developer<br/>git push main"]

    subgraph GHA["⚙️ GitHub Actions"]
        direction TB

        subgraph BACKEND_PIPE["Backend Pipeline"]
            B1["📋 Checkout code"]
            B2["🐍 Setup Python 3.12"]
            B3["🔍 ruff check .<br/>(linting)"]
            B4["🔍 ruff format --check<br/>(formato)"]
            B5["🧪 pytest --cov=app<br/>(tests + coverage ≥80%)"]
            B6["🐳 docker build backend"]
            B7["🚀 Deploy → Koyeb"]
            B1-->B2-->B3-->B4-->B5-->B6-->B7
        end

        subgraph FRONTEND_PIPE["Frontend Pipeline"]
            F1["📋 Checkout code"]
            F2["📦 Setup Node + pnpm install"]
            F3["🔍 tsc --noEmit<br/>(type check)"]
            F4["🔍 eslint .<br/>(linting)"]
            F5["🧪 jest --coverage<br/>(unit tests)"]
            F6["🏗️ next build<br/>(build check)"]
            F7["🚀 Deploy → Vercel"]
            F1-->F2-->F3-->F4-->F5-->F6-->F7
        end
    end

    subgraph PROD["🌐 Producción"]
        KOYEB["Koyeb<br/>backend:latest"]
        VERCEL_P["Vercel<br/>frontend:latest"]
    end

    DEV -->|"trigger"| GHA
    B7 --> KOYEB
    F7 --> VERCEL_P

    %% Si algo falla, no se deploya
    B3 & B4 & B5 -.->|"❌ falla → pipeline se detiene"| STOP["🛑 No deploy"]
    F3 & F4 & F5 & F6 -.->|"❌ falla → pipeline se detiene"| STOP

    classDef success fill:#2e7d32,stroke:#1b5e20,color:#fff
    classDef fail fill:#c62828,stroke:#b71c1c,color:#fff
    classDef neutral fill:#1565c0,stroke:#0d47a1,color:#fff

    class KOYEB,VERCEL_P success
    class STOP fail
    class DEV neutral
```

---

## 6. Estructura de Módulos (Backend)

Cómo se organiza el código en carpetas, siguiendo Clean Architecture.

```
backend/
├── app/
│   ├── domain/                    # ← NÚCLEO PURO (0 imports externos)
│   │   ├── entities/
│   │   │   ├── user.py            # User, UserRole
│   │   │   ├── product.py         # Product, Category
│   │   │   ├── order.py           # Order, OrderItem, OrderStatus
│   │   │   ├── review.py          # Review, Sentiment, ModerationStatus
│   │   │   └── payment.py         # Payment, PaymentStatus
│   │   ├── value_objects/
│   │   │   ├── money.py           # Money(amount, currency="COP")
│   │   │   ├── email.py           # Email (validación en dominio)
│   │   │   └── risk_score.py      # RiskScore(0.0-1.0) + nivel
│   │   └── repositories/          # Interfaces (puertos)
│   │       ├── i_user_repo.py
│   │       ├── i_product_repo.py
│   │       ├── i_order_repo.py
│   │       └── i_ai_service.py    # IAIService (embed, moderate, chat)
│   │
│   ├── application/               # ← CASOS DE USO
│   │   ├── auth/
│   │   │   ├── register_user.py
│   │   │   └── login_user.py
│   │   ├── products/
│   │   │   ├── create_product.py
│   │   │   └── search_products.py # RRF search
│   │   ├── orders/
│   │   │   ├── create_order.py
│   │   │   └── process_payment.py
│   │   ├── reviews/
│   │   │   └── moderate_review.py
│   │   ├── chat/
│   │   │   └── chat_with_assistant.py
│   │   └── fraud/
│   │       └── evaluate_transaction.py
│   │
│   ├── infrastructure/            # ← ADAPTADORES (implementan interfaces)
│   │   ├── database/
│   │   │   ├── models.py          # SQLAlchemy ORM models
│   │   │   ├── repositories/      # Implementaciones concretas
│   │   │   └── migrations/        # Alembic
│   │   ├── cache/
│   │   │   └── redis_client.py    # redis-py async
│   │   ├── ai/
│   │   │   └── gemini_adapter.py  # Gemini Flash + embeddings + Function Calling
│   │   ├── payments/
│   │   │   └── wompi_adapter.py   # Wompi Colombia
│   │   ├── email/
│   │   │   └── resend_adapter.py
│   │   └── storage/
│   │       └── supabase_storage.py
│   │
│   └── presentation/              # ← FASTAPI ROUTERS + SCHEMAS
│       ├── api/
│       │   ├── v1/
│       │   │   ├── auth.py
│       │   │   ├── products.py
│       │   │   ├── search.py
│       │   │   ├── cart.py
│       │   │   ├── orders.py
│       │   │   ├── payments.py    # + webhook endpoint
│       │   │   ├── reviews.py
│       │   │   ├── chat.py        # SSE streaming
│       │   │   └── admin/
│       │   └── router.py
│       └── schemas/               # Pydantic v2 schemas (DTO)
│           ├── auth.py
│           ├── product.py
│           └── order.py
│
├── tests/
│   ├── unit/                      # TDD — domain + application
│   │   ├── domain/
│   │   └── application/
│   └── integration/               # Tests con BD real
│       └── api/
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── pyproject.toml                 # ruff + pytest config
```

---

*Siguiente documento: `docs/er-diagram.md` — Entidades y relaciones de la base de datos.*
