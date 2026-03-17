# Primera Entrega — Prototipo Arquitectónico

> **Curso:** Arquitectura de Software (Arquisoft)  
> **Entrega:** Primera Entrega — Prototipo Vertical  
> **Fecha:** 2026-03-18

---

## Equipo

**Nombre:** Grupo D

| # | Nombre completo |
|---|---|
| 1 | Sara Isabel Ospina Valderrama |
| 2 | Juan David Ruiz Guasca |
| 3 | Juan David Castañeda Cárdenas |
| 4 | John Alejandro Pastor Sandoval |
| 5 | Andrés Felipe Perdomo Uruburu |

---

## Sistema de Software

**Nombre:** *(Por definir)*

**Logo:** *(Por agregar)*

**Descripción:**

Plataforma de comercio electrónico B2C inteligente para el mercado colombiano que permite a los usuarios explorar un catálogo de productos multi-categoría, gestionar un carrito de compras, completar compras a través de una pasarela de pagos colombiana y recibir recomendaciones personalizadas mediante un asistente conversacional con IA.

El sistema integra Google Gemini Flash como proveedor de IA generativa para ofrecer búsqueda inteligente de productos, recomendaciones personalizadas basadas en el historial de navegación y compras, y moderación automatizada de reseñas — sin requerir entrenamiento propio de modelos de ML.

---

## Requerimientos Funcionales

Los siguientes requerimientos funcionales definen el dominio y el alcance del sistema:

| ID | Descripción |
|---|---|
| RF-01 | El sistema debe permitir el registro de nuevos usuarios, inicio de sesión y gestión de perfiles individuales. |
| RF-02 | El sistema debe almacenar el historial de compras y las interacciones de los usuarios con los productos, incluyendo acciones como la visualización y la adquisición de productos. |
| RF-03 | El sistema debe permitir a los clientes visualizar el catálogo completo de productos disponibles en la plataforma. |
| RF-04 | El sistema debe permitir a los usuarios gestionar su carrito de compras, incluyendo agregar productos, eliminar productos y modificar la cantidad de unidades antes de realizar la compra. |
| RF-05 | El sistema debe generar recomendaciones de productos personalizadas utilizando un sistema de inteligencia artificial que analice el historial de compras y las interacciones de los usuarios con los productos. |
| RF-06 | El sistema debe permitir a los usuarios publicar reseñas y calificaciones sobre los productos que hayan adquirido. |
| RF-07 | El sistema debe exponer un asistente conversacional de IA generativa que ayude al usuario a encontrar productos, resolver dudas y recibir recomendaciones en lenguaje natural. |
| RF-08 | El sistema debe permitir a los usuarios registrar y publicar productos de calzado en el catálogo de la plataforma para su venta. |
| RF-09 | El sistema debe permitir a los usuarios visualizar las estadísticas de ventas realizadas, incluyendo información como número de productos vendidos, ingresos generados y productos más vendidos. |
| RF-10 | El sistema debe permitir a los usuarios completar el proceso de checkout para finalizar la compra de los productos seleccionados, ingresando la información de envío y seleccionando un método de pago disponible. |
| RF-11 | El sistema debe permitir a los clientes buscar productos por nombre o categoría y aplicar filtros para refinar los resultados de búsqueda. |
### Alcance Funcional del Prototipo (Primera Entrega)

El prototipo demuestra un **corte vertical mínimo** del sistema: un flujo completo de extremo a extremo que atraviesa todas las capas arquitectónicas con la menor complejidad funcional posible.

**Flujo cubierto:**

1. **Inicio de sesión** (RF-01) — el usuario ingresa sus credenciales → `core-service` valida y emite JWT → sesión guardada en Redis
2. **Catálogo de productos** (RF-03) — el usuario navega el catálogo por categoría → `core-service` consulta PostgreSQL → `ai-service` agrega una recomendación simple basada en la categoría consultada (Gemini Flash)

---

## Requerimientos No Funcionales

| ID | Descripción | Cómo se satisface |
|---|---|---|
| RNF-01 | **Disponibilidad:** el sistema debe ser resiliente ante fallos de componentes individuales mediante una arquitectura distribuida en contenedores. | `core-service` y `ai-service` son servicios independientes. Un fallo en `ai-service` no interrumpe el flujo de e-commerce del `core-service`. Cada servicio corre en su propio contenedor Docker. |
| RNF-02 | **Separación de responsabilidades:** la lógica de negocio debe distribuirse en microservicios independientes, cada uno con una única responsabilidad de dominio. | `core-service` (auth, productos, órdenes, pagos, reseñas) y `ai-service` (Gemini, recomendaciones, búsqueda semántica, moderación) — dominios completamente separados, desplegables de forma independiente. |
| RNF-03 | **Asistencia IA generativa:** integrar un LLM a través de una API externa para el asistente conversacional y las recomendaciones, sin entrenamiento propio de modelos. | Google Gemini Flash API vía `google-generativeai` SDK. Se consume como API externa. No hay entrenamiento propio ni modelos locales. |
| RNF-04 | **Categorización del catálogo:** los productos deben estar categorizados para facilitar su localización. | Tabla `categories` en PostgreSQL con relación a `products`. El frontend expone filtros y navegación por categoría. |
| RNF-05 | **Despliegue en contenedores:** todos los componentes deben desplegarse localmente mediante Docker Compose con un único comando. | `docker compose up --build` levanta: `frontend`, `core-service`, `ai-service`, `postgres` y `redis`. Un solo comando. |
| RNF-06 | **Multilenguaje:** el sistema debe usar al menos dos lenguajes de programación de propósito general. | Python 3.12 (FastAPI — `core-service` + `ai-service`) y JavaScript/TypeScript (Next.js 14 — `frontend`). |

### Requerimientos del Curso 

| ID | Requerimiento | Cómo se satisface |
|---|---|---|
| C-RNF-01 | Arquitectura distribuida | Tres unidades desplegables independientes: `frontend` + `core-service` + `ai-service`, comunicadas por HTTP |
| C-RNF-02 | Al menos un componente de presentación (frontend web) | Next.js 14 App Router — desplegado en Vercel |
| C-RNF-03 | Al menos dos componentes de lógica | `core-service` y `ai-service` — microservicios Python independientes |
| C-RNF-04 | Al menos dos componentes de datos (relacional + NoSQL) | PostgreSQL 15 + pgvector (relacional) y Redis Cloud (NoSQL clave-valor) |
| C-RNF-05 | Al menos dos tipos distintos de conectores HTTP | ① REST JSON/HTTPS — frontend ↔ servicios backend  ② REST interno (httpx async) — core-service → ai-service |
| C-RNF-06 | Al menos dos lenguajes de programación | Python 3.12 (FastAPI) y TypeScript (Next.js 14) |
| C-RNF-07 | Despliegue orientado a contenedores | Todos los componentes en Docker — `docker compose up` despliega el sistema completo localmente |

---

## Estructuras Arquitectónicas

#### Contexto del Sistema

```mermaid
C4Context
    title Diagrama de Contexto — Plataforma E-commerce

    Person(customer, "Cliente", "Registra su cuenta, navega el catálogo, gestiona su carrito, completa compras y recibe recomendaciones con IA")
    Person(admin, "Administrador", "Gestiona el catálogo de productos, revisa órdenes y modera reseñas de usuarios")

    System(platform, "Plataforma E-commerce", "Sistema B2C inteligente con IA generativa. Catálogo multi-categoría, carrito, checkout con métodos de pago colombianos y recomendaciones personalizadas")

    System_Ext(gemini, "Google Gemini Flash API", "LLM externo para asistente conversacional, recomendaciones, embeddings de búsqueda semántica y moderación de reseñas")
    System_Ext(wompi, "Wompi Colombia", "Pasarela de pagos colombiana — PSE, Nequi y tarjetas débito/crédito")
    SystemDb_Ext(supabase, "Supabase", "PostgreSQL 15 gestionado con extensión pgvector para búsqueda semántica y almacenamiento de imágenes")
    System_Ext(redis, "Redis Cloud", "Caché NoSQL clave-valor — sesiones JWT, carritos de compra y TTL de búsquedas")

    Rel(customer, platform, "Navega, compra, usa chatbot IA", "HTTPS")
    Rel(admin, platform, "Gestiona catálogo y órdenes", "HTTPS")
    Rel(platform, gemini, "Chat, recomendaciones, embeddings, moderación", "HTTPS / Gemini SDK")
    Rel(platform, wompi, "Procesa pagos, recibe webhooks", "HTTPS / REST")
    Rel(platform, supabase, "Almacena y consulta datos e imágenes", "PostgreSQL (TLS)")
    Rel(platform, redis, "Cachea sesiones, carritos y consultas", "Redis (TLS)")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

#### Diagrama de Contenedores

```mermaid
C4Container
    title Diagrama de Contenedores — Plataforma E-commerce

    Person(customer, "Cliente", "Comprador final")
    Person(admin, "Administrador", "Gestor de la tienda")

    System_Boundary(platform, "Plataforma E-commerce") {
        Container(frontend, "Frontend Next.js", "TypeScript, Next.js 14 App Router", "Catálogo de productos, carrito, checkout, historial de órdenes, panel admin y widget de chatbot IA")
        Container(core, "core-service", "Python 3.12, FastAPI, SQLAlchemy 2.0", "Autenticación, catálogo de productos, carrito, órdenes, pagos y reseñas. Lógica de negocio principal.")
        Container(ai, "ai-service", "Python 3.12, FastAPI, google-generativeai", "Asistente IA conversacional (Gemini), recomendaciones personalizadas, búsqueda semántica con pgvector y moderación de reseñas con LLM")
        ContainerDb(db, "Base de Datos PostgreSQL", "Supabase PostgreSQL 15 + pgvector", "Almacena usuarios, productos, órdenes, reseñas, pagos y vectores de embeddings para búsqueda semántica")
        ContainerDb(cache, "Caché Redis", "Redis Cloud — NoSQL clave-valor", "Sesiones JWT, estado del carrito, caché de resultados de búsqueda (TTL) y rate limiting")
    }

    System_Ext(gemini, "Google Gemini Flash API", "LLM + text-embedding-004")
    System_Ext(wompi, "Wompi Colombia", "PSE · Nequi · Tarjetas")

    Rel(customer, frontend, "Navega y compra", "HTTPS")
    Rel(admin, frontend, "Gestiona la tienda", "HTTPS")
    Rel(frontend, core, "Auth, productos, órdenes, pagos, reseñas", "① REST API — JSON/HTTPS")
    Rel(frontend, ai, "Chat IA, búsqueda semántica, recomendaciones", "① REST API — JSON/HTTPS")
    Rel(core, ai, "Solicita recomendaciones y moderación de reseñas", "② REST Interno — httpx async")
    Rel(core, db, "Lee/escribe datos de negocio", "PostgreSQL (TLS)")
    Rel(ai, db, "Lee vectores de productos, escribe embeddings", "PostgreSQL (TLS)")
    Rel(core, cache, "Sesiones, carrito, rate limits", "Redis (TLS)")
    Rel(ai, cache, "Cachea respuestas de Gemini (TTL)", "Redis (TLS)")
    Rel(core, wompi, "Pagos + webhooks HMAC-SHA256", "HTTPS / REST")
    Rel(ai, gemini, "Chat, embeddings, moderación", "HTTPS / Gemini SDK")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

#### Descripción de los Estilos Arquitectónicos Utilizados

**1. Arquitectura de Microservicios**

El backend está dividido en dos servicios independientes con responsabilidades de dominio únicas:

- **`core-service`** — propietario de toda la lógica de negocio del e-commerce: autenticación, catálogo de productos, carrito de compras, órdenes y pagos. Desplegado en Koyeb (free tier always-ON).
- **`ai-service`** — propietario de todas las funcionalidades de IA: asistente conversacional, recomendaciones de productos, búsqueda semántica y moderación de reseñas. Desplegado en Render (free tier). Integrado con Google Gemini Flash.

Ambos servicios son desplegables de forma independiente y tolerantes a fallos. Un fallo en `ai-service` no interrumpe el flujo principal del e-commerce.

**2. Clean Architecture (por servicio)**

Cada microservicio sigue Clean Architecture (Modelo Cebolla) con una dirección de dependencia estrictamente hacia adentro:

```
Presentación → Aplicación → Dominio ← Infraestructura
```

- **Capa de Dominio** — entidades Python puras, value objects e interfaces de repositorio. Cero imports externos.
- **Capa de Aplicación** — casos de uso que orquestan la lógica del dominio.
- **Capa de Infraestructura** — implementaciones concretas: repositorios SQLAlchemy, caché Redis, adaptador Gemini, adaptador Wompi.
- **Capa de Presentación** — routers FastAPI y esquemas Pydantic v2.

**3. Patrón BFF (Backend for Frontend)**

Next.js actúa como BFF: llama a `core-service` y `ai-service` desde componentes del lado del servidor, agregando las respuestas antes de renderizar. Esto evita exponer las URLs internas de los servicios al navegador.

---

#### Descripción de Elementos y Relaciones Arquitectónicas

| Elemento | Tipo | Tecnología | Responsabilidad |
|---|---|---|---|
| `Frontend Next.js` | Componente de presentación | TypeScript, Next.js 14 | Renderiza la UI; llama a core-service y ai-service vía REST |
| `core-service` | Componente de lógica | Python 3.12, FastAPI | Auth, productos, órdenes, carrito, pagos, reseñas |
| `ai-service` | Componente de lógica | Python 3.12, FastAPI | Chatbot Gemini, recomendaciones, búsqueda semántica, moderación |
| `PostgreSQL + pgvector` | Componente de datos (relacional) | Supabase PostgreSQL 15 | Almacenamiento persistente de entidades de dominio + vectores de embeddings |
| `Redis` | Componente de datos (NoSQL clave-valor) | Redis Cloud | Caché de sesiones, estado del carrito, TTL de búsquedas, rate limiting |
| `Conector REST ①` | Conector HTTP | JSON / HTTPS | Comunicación entre frontend y servicios backend |
| `Conector REST interno ②` | Conector HTTP | httpx async / HTTPS | Comunicación de core-service hacia ai-service |
| `Google Gemini Flash` | Sistema externo | google-generativeai SDK | Proveedor LLM: chat, embeddings, moderación |
| `Wompi Colombia` | Sistema externo | REST API | Pasarela de pagos: PSE, Nequi, tarjetas |

---

## Prototipo

### Instrucciones de Despliegue Local

**Prerequisitos:**
- Docker Desktop instalado y en ejecución
- Git

**Pasos:**

```bash
# 1. Clonar el repositorio
git clone https://github.com/jpastor1649/ecommerce-project.git
cd ecommerce-project

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env y completar:
#   GEMINI_API_KEY=tu_clave_aqui
#   WOMPI_PUBLIC_KEY=tu_clave_aqui
#   WOMPI_PRIVATE_KEY=tu_clave_aqui

# 3. Levantar todos los servicios con un solo comando
docker compose up --build

# 4. Acceder a la aplicación
# Frontend:                    http://localhost:3000
# Documentación core-service:  http://localhost:8000/docs
# Documentación ai-service:    http://localhost:8001/docs
```

**Servicios levantados por `docker compose up`:**

| Servicio | Puerto | Tecnología | Descripción |
|---|---|---|---|
| `frontend` | 3000 | Next.js 14 | Aplicación web |
| `core-service` | 8000 | FastAPI (Python) | API de lógica de negocio |
| `ai-service` | 8001 | FastAPI (Python) | API de funcionalidades IA |
| `postgres` | 5432 | PostgreSQL 15 + pgvector | Base de datos relacional |
| `redis` | 6379 | Redis | Caché NoSQL |

**Para detener todos los servicios:**
```bash
docker compose down
```

---

*Documento generado en Fase 0 — Grupo D, Arquisoft.*

