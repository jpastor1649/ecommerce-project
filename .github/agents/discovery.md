# 🔍 Fase 0 - Descubrimiento del Proyecto E-commerce

> Archivo de memoria generado automáticamente por el Arquitecto Senior
> Estado: COMPLETADO ✅

---

## BLOQUE 1 - El Negocio
- **Tipo de productos:** Físicos de cualquier categoría (generalista)
- **Estado del negocio:** Nuevo, desde cero. Proyecto académico.
- **Mercado objetivo:** B2C — venta directa al consumidor final
- **País/región:** Colombia 🇨🇴

## BLOQUE 2 - Escala y Crecimiento
- **Catálogo inicial:** 500 - 5,000 productos
- **Usuarios al lanzar:** MVP/validación (<100 usuarios/día)
- **Presupuesto:** $0 — solo free tiers

## BLOQUE 3 - Features Requeridas
- **Plataforma:** Solo web al inicio, pero **API-first** para escalar a app móvil después
- **Idiomas:** Español + Inglés (i18n desde el inicio con `next-intl`)
- **Moneda:** COP principal, arquitectura escalable a USD
- **Pasarela de pago:** Wompi (Colombia — PSE, Nequi, tarjetas, sandbox gratis)

## BLOQUE 4 - IA
- **Proveedor LLM:** Google Gemini 1.5 Flash (1M tokens/día gratis)
- **Integración IA:** Gemini Function Calling (no MCP — innecesario para MVP)
- **Módulos IA (todos):**
  1. 🔍 Búsqueda semántica (Hybrid Search FTS + pgvector + RRF)
  2. ⭐ Asistente de reseñas (moderación + sentimiento + resumen)
  3. 💬 Chatbot RAG (asistente de compras con streaming)
  4. 🎯 Recomendaciones (Collaborative + Content-Based + LLM ensemble)
  5. 🚨 Detección de fraude (Rules → ML → LLM zona gris)

## BLOQUE 5 - Equipo y Tecnología
- **Equipo:** 1 desarrollador (líder), arquitectar como equipo de 4-5
- **Lenguaje:** Python intermedio + JS básico
- **Docker:** Básico, aprendiendo
- **Frontend:** Next.js + React (confirmado)

---

## STACK DEFINITIVO (100% Gratuito)

| Capa | Tecnología | Free Tier |
|------|-----------|-----------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind CSS | Vercel ✅ |
| **UI Components** | shadcn/ui + Zustand + TanStack Query | Gratis ✅ |
| **i18n** | next-intl (ES/EN) | Gratis ✅ |
| **Backend** | FastAPI + Python 3.12 + Pydantic v2 | Koyeb ✅ |
| **ORM + Migraciones** | SQLAlchemy 2.0 async + Alembic | Gratis ✅ |
| **BD Principal** | Supabase PostgreSQL 15 + pgvector | 500MB ✅ |
| **Cache / Sesiones** | Redis Cloud + `redis-py` (async) | 30MB ✅ |
| **Auth** | JWT + bcrypt custom (sin vendor lock-in) | Gratis ✅ |
| **IA - LLM** | Google Gemini 1.5 Flash | 1,500 req/día ✅ |
| **IA - Embeddings** | Gemini text-embedding-004 | Gratis ✅ |
| **IA - Búsqueda** | pgvector en Supabase | Gratis ✅ |
| **Pagos** | Wompi (PSE, Nequi, tarjetas) | Sandbox ✅ |
| **Storage Imágenes** | Supabase Storage | 1GB ✅ |
| **Emails** | Resend | 3K/mes ✅ |
| **CI/CD** | GitHub Actions | Gratis ✅ |
| **Contenedores** | Docker + Docker Compose | Gratis ✅ |
| **Errores** | Sentry free tier | 5K/mes ✅ |

## DECISIONES TÉCNICAS CLAVE

| Decisión | Elegido | Descartado | Razón |
|---------|---------|-----------|-------|
| Cache | Redis Cloud + `redis-py` | aiocache memory | Persistencia real entre reinicios |
| NoSQL | ❌ No se necesita | MongoDB Atlas | pgvector + JSONB cubre el 100% |
| IA protocol | Gemini Function Calling | MCP | MCP es de Anthropic/Claude, no aplica a Gemini |
| Deploy backend | Koyeb (siempre ON) | Railway | Railway se apaga a los 10 días del mes |
| Vector DB | pgvector en Supabase | Pinecone | Sin servicio extra, suficiente para <50K productos |
| LLM | Gemini Flash | OpenAI GPT-4o | Gemini = gratis, OpenAI = de pago |

## ARQUITECTURA DE PERSISTENCIA

```
PostgreSQL (Supabase)              Redis Cloud
────────────────────               ─────────────────────────
✅ Usuarios                        ✅ Carrito (TTL 7 días)
✅ Productos + categorías          ✅ Sesiones JWT activas
✅ Órdenes + pagos                 ✅ Blacklist tokens
✅ Reseñas                         ✅ Cache productos populares
✅ Embeddings (pgvector)           ✅ Rate limiting counters
✅ Logs auditoría                  ✅ Lock de stock (anti-oversell)
✅ Configs JSONB                   ✅ Chat history RAG (TTL)
```

## CI/CD PIPELINE (GitHub Actions)

```
Push/PR → Lint (ruff + ESLint) → Tests (pytest + Playwright) → Docker Build → Deploy
         Job 1 (2 min)           Job 2 (5 min)                 Job 3 (3 min)   Job 4 (main only)
```

## ROADMAP (14 semanas)

| Semana | Fase | Entregable |
|--------|------|-----------|
| 1 | Fundación | Monorepo, Git flow, Docker local, .env seguro |
| 2 | Base de Datos | Diagrama ER, modelos SQLAlchemy, migraciones, Supabase + pgvector |
| 3 | Auth Backend | JWT + bcrypt + endpoints + middleware + roles |
| 4 | Auth Frontend | Login UI, guards de rutas, manejo de tokens |
| 5 | Catálogo BE | CRUD productos + categorías + imágenes Supabase Storage |
| 6 | Catálogo FE | Listados, búsqueda básica, detalle producto |
| 7 | Carrito + Órdenes | Carrito Redis, flujo orden, estados |
| 8 | Checkout FE | UI checkout, resumen de orden |
| 9 | Pagos BE | Wompi sandbox, PSE, Nequi, webhooks |
| 10 | Pagos FE | UI pago, estados, emails confirmación |
| 11 | IA Búsqueda | Embeddings Gemini, búsqueda semántica pgvector |
| 12 | IA Chat + Reco | Chatbot RAG + recomendaciones personalizadas |
| 13 | IA Reseñas + Fraude | Moderación, sentimiento, detección fraude |
| 14 | Deploy + Hardening | CI/CD, Koyeb, Vercel, tests E2E, OWASP checklist |

## FASE ACTUAL
**→ Fase 1: Fundación** — Monorepo + Docker + .env + GitHub Actions

---
*Última actualización: 2026-03-13 — Fase 0 completada*
