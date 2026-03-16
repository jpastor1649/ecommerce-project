# Estructura del Proyecto — E-commerce Colombia

> Referencia completa de la arquitectura de carpetas.  
> **No se crea todo de una vez** — se construye fase por fase.

---

## Árbol completo

```
ecommerce-project/                          ← raíz del monorepo
│
├── .github/
│   ├── agents/
│   │   ├── ecommerce-mentor.agent.md       ✅ creado
│   │   ├── discovery.md                    ✅ creado
│   │   └── skills.md                       ✅ creado
│   └── workflows/
│       ├── backend.yml                     ✅ creado
│       └── frontend.yml                    ✅ creado
│
├── docs/
│   ├── requirements.md                     ✅ creado
│   ├── architecture.md                     ✅ creado
│   └── er-diagram.md                       ✅ creado
│
│
├── backend/                                ← FastAPI + Python 3.12
│   │
│   ├── app/
│   │   │
│   │   ├── domain/                         ← NÚCLEO PURO (0 imports externos)
│   │   │   ├── __init__.py
│   │   │   ├── entities/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── user.py                 # User, UserRole
│   │   │   │   ├── product.py              # Product, Category
│   │   │   │   ├── order.py                # Order, OrderItem, OrderStatus
│   │   │   │   ├── review.py               # Review, Sentiment, ModerationStatus
│   │   │   │   └── payment.py              # Payment, PaymentStatus
│   │   │   │
│   │   │   ├── value_objects/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── money.py                # Money(amount, currency="COP")
│   │   │   │   ├── email.py                # Email con validación de dominio
│   │   │   │   └── risk_score.py           # RiskScore(0.0-1.0) + nivel
│   │   │   │
│   │   │   └── repositories/              ← Interfaces (puertos / contratos)
│   │   │       ├── __init__.py
│   │   │       ├── i_user_repository.py
│   │   │       ├── i_product_repository.py
│   │   │       ├── i_order_repository.py
│   │   │       ├── i_review_repository.py
│   │   │       └── i_ai_service.py        # embed(), moderate(), chat()
│   │   │
│   │   ├── application/                   ← CASOS DE USO (orquestadores)
│   │   │   ├── __init__.py
│   │   │   ├── auth/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── register_user.py
│   │   │   │   ├── login_user.py
│   │   │   │   └── refresh_token.py
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── create_product.py
│   │   │   │   ├── update_product.py
│   │   │   │   └── search_products.py     # RRF: semántico + full-text
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── add_to_cart.py
│   │   │   │   └── get_cart.py
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── create_order.py
│   │   │   │   └── update_order_status.py
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── initiate_payment.py
│   │   │   │   └── handle_webhook.py
│   │   │   │
│   │   │   ├── reviews/
│   │   │   │   ├── __init__.py
│   │   │   │   └── moderate_review.py     # Gemini → sentimiento + moderación
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── __init__.py
│   │   │   │   └── chat_with_assistant.py # RAG + streaming SSE
│   │   │   │
│   │   │   └── fraud/
│   │   │       ├── __init__.py
│   │   │       └── evaluate_transaction.py # reglas → heurística → Gemini
│   │   │
│   │   ├── infrastructure/                ← ADAPTADORES (implementan interfaces)
│   │   │   ├── __init__.py
│   │   │   │
│   │   │   ├── database/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── connection.py          # engine async + session factory
│   │   │   │   ├── models.py              # SQLAlchemy ORM models (18 tablas)
│   │   │   │   ├── repositories/          # Implementaciones concretas
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── user_repository.py
│   │   │   │   │   ├── product_repository.py
│   │   │   │   │   ├── order_repository.py
│   │   │   │   │   └── review_repository.py
│   │   │   │   └── migrations/            # Alembic
│   │   │   │       ├── env.py
│   │   │   │       ├── script.py.mako
│   │   │   │       └── versions/          # archivos de migración versionados
│   │   │   │
│   │   │   ├── cache/
│   │   │   │   ├── __init__.py
│   │   │   │   └── redis_client.py        # redis-py async + helpers
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── __init__.py
│   │   │   │   └── gemini_adapter.py      # Gemini Flash + embeddings + FC
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── __init__.py
│   │   │   │   └── wompi_adapter.py       # Wompi Colombia (PSE, Nequi, Card)
│   │   │   │
│   │   │   ├── email/
│   │   │   │   ├── __init__.py
│   │   │   │   └── resend_adapter.py      # Resend + plantillas
│   │   │   │
│   │   │   └── storage/
│   │   │       ├── __init__.py
│   │   │       └── supabase_storage.py    # Subida y URLs de imágenes
│   │   │
│   │   └── presentation/                  ← FASTAPI (routers + schemas)
│   │       ├── __init__.py
│   │       ├── main.py                    # App FastAPI + lifespan + middleware
│   │       │
│   │       ├── api/
│   │       │   ├── __init__.py
│   │       │   ├── deps.py                # Dependencias: get_db, get_current_user
│   │       │   └── v1/
│   │       │       ├── __init__.py
│   │       │       ├── router.py          # Agrupa todos los routers v1
│   │       │       ├── auth.py            # POST /auth/register, /login, /refresh
│   │       │       ├── products.py        # GET/POST/PUT/DELETE /products
│   │       │       ├── search.py          # GET /search
│   │       │       ├── cart.py            # GET/POST/PUT/DELETE /cart
│   │       │       ├── orders.py          # GET/POST /orders
│   │       │       ├── payments.py        # POST /payments, /payments/webhook
│   │       │       ├── reviews.py         # GET/POST /reviews
│   │       │       ├── chat.py            # POST /chat (SSE streaming)
│   │       │       └── admin/
│   │       │           ├── __init__.py
│   │       │           ├── router.py
│   │       │           ├── products.py
│   │       │           ├── orders.py
│   │       │           ├── reviews.py
│   │       │           └── fraud.py
│   │       │
│   │       └── schemas/                   # Pydantic v2 — Request/Response DTOs
│   │           ├── __init__.py
│   │           ├── auth.py
│   │           ├── product.py
│   │           ├── order.py
│   │           ├── review.py
│   │           └── chat.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py                    # fixtures globales: db, redis, client
│   │   ├── unit/                          ← TDD: dominio + casos de uso
│   │   │   ├── domain/
│   │   │   │   ├── test_user.py
│   │   │   │   ├── test_order.py
│   │   │   │   ├── test_money.py
│   │   │   │   └── test_risk_score.py
│   │   │   └── application/
│   │   │       ├── test_register_user.py
│   │   │       ├── test_create_order.py
│   │   │       └── test_moderate_review.py
│   │   └── integration/                   ← Tests con BD + Redis reales
│   │       └── api/
│   │           ├── test_auth.py
│   │           ├── test_products.py
│   │           └── test_orders.py
│   │
│   ├── Dockerfile
│   ├── .env.example                       # Variables de entorno documentadas
│   └── pyproject.toml                     ✅ creado
│
│
├── frontend/                              ← Next.js 14 App Router + TypeScript
│   │
│   ├── src/
│   │   ├── app/                           ← App Router (páginas y layouts)
│   │   │   ├── layout.tsx                 # Root layout (fuentes, providers)
│   │   │   ├── page.tsx                   # Home — listado de productos
│   │   │   ├── [locale]/                  # next-intl — soporte ES/EN
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── (shop)/                # Grupo: tienda pública
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── page.tsx       # Catálogo
│   │   │   │   │   │   └── [slug]/
│   │   │   │   │   │       └── page.tsx   # Detalle de producto
│   │   │   │   │   ├── search/
│   │   │   │   │   │   └── page.tsx       # Resultados búsqueda
│   │   │   │   │   └── cart/
│   │   │   │   │       └── page.tsx       # Carrito
│   │   │   │   │
│   │   │   │   ├── (auth)/                # Grupo: autenticación
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   └── register/page.tsx
│   │   │   │   │
│   │   │   │   ├── (account)/             # Grupo: cuenta del cliente
│   │   │   │   │   ├── orders/page.tsx
│   │   │   │   │   ├── orders/[id]/page.tsx
│   │   │   │   │   └── profile/page.tsx
│   │   │   │   │
│   │   │   │   └── (admin)/               # Grupo: panel admin (protegido)
│   │   │   │       ├── layout.tsx         # Guard: solo rol admin
│   │   │   │       ├── dashboard/page.tsx
│   │   │   │       ├── products/page.tsx
│   │   │   │       ├── orders/page.tsx
│   │   │   │       ├── reviews/page.tsx
│   │   │   │       └── fraud/page.tsx
│   │   │   │
│   │   │   └── api/                       # Next.js Route Handlers
│   │   │       └── auth/[...nextauth]/    # (si se usa next-auth en futuro)
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                        # shadcn/ui (generados automáticamente)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   └── ProductDetail.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   └── CartItem.tsx
│   │   │   ├── chat/
│   │   │   │   └── ChatWidget.tsx         # Chatbot con SSE streaming
│   │   │   └── admin/
│   │   │       ├── DataTable.tsx
│   │   │       └── StatsCard.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts              # axios/fetch configurado con base URL
│   │   │   │   ├── auth.ts                # login, register, refresh
│   │   │   │   ├── products.ts
│   │   │   │   ├── orders.ts
│   │   │   │   └── reviews.ts
│   │   │   ├── store/                     # Zustand
│   │   │   │   ├── auth.store.ts          # usuario autenticado + tokens
│   │   │   │   └── cart.store.ts          # carrito local
│   │   │   ├── hooks/                     # TanStack Query hooks
│   │   │   │   ├── useProducts.ts
│   │   │   │   ├── useOrders.ts
│   │   │   │   └── useSearch.ts
│   │   │   └── utils.ts                   # cn(), formatCOP(), formatDate()
│   │   │
│   │   ├── i18n/                          # next-intl
│   │   │   ├── routing.ts
│   │   │   └── messages/
│   │   │       ├── es.json
│   │   │       └── en.json
│   │   │
│   │   └── types/
│   │       ├── api.ts                     # tipos de respuesta del API
│   │       └── index.ts                   # tipos globales
│   │
│   ├── public/
│   │   └── images/
│   │
│   ├── .env.example
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore                             ✅ actualizado
└── README.md
```

---

## Qué se construye en cada fase

| Fase | Qué se crea |
|------|------------|
| **Fase 1** ← estamos aquí | Estructura de carpetas + `pyproject.toml` + `Dockerfile` + `.env.example` + `docker-compose.yml` + `next.config.ts` |
| **Fase 2** | `domain/entities/` + `domain/value_objects/` + `infrastructure/database/models.py` + Alembic migraciones |
| **Fase 3** | `application/auth/` + `presentation/api/v1/auth.py` + JWT + bcrypt |
| **Fase 4** | `application/products/` + `infrastructure/ai/gemini_adapter.py` (embeddings) + búsqueda |
| **Fase 5** | `application/cart/` + `application/orders/` + Redis carrito |
| **Fase 6** | `application/payments/` + Wompi + webhook |
| **Fase 7** | IA completa: reseñas → chatbot RAG → recomendaciones → fraude |
| **Fase 8** | Frontend completo + deploy Koyeb + Vercel + hardening OWASP |
