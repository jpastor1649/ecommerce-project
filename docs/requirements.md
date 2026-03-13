# Requerimientos del Sistema — E-commerce Generalista Colombia

> **Versión:** 1.0  
> **Fecha:** 2026-03-13  
> **Estado:** Borrador  
> **Proyecto:** E-commerce B2C Colombia — MVP Académico con estándares de producción

---

## 1. Objetivo General del Sistema

Desarrollar una plataforma de comercio electrónico B2C orientada al mercado colombiano que permita a compradores descubrir, evaluar y adquirir productos físicos de forma segura y fluida, integrando módulos de inteligencia artificial para mejorar la experiencia de búsqueda, recomendaciones, asistencia y detección de fraude.

---

## 2. Objetivos Específicos

1. **OE-01** — Proveer un catálogo de productos con búsqueda semántica impulsada por IA (pgvector + Gemini embeddings).
2. **OE-02** — Implementar un flujo de compra completo: carrito → checkout → pago (Wompi: PSE, Nequi, tarjetas).
3. **OE-03** — Gestionar autenticación segura basada en JWT + bcrypt con roles diferenciados (cliente, administrador).
4. **OE-04** — Integrar un asistente de reseñas que modere contenido y analice sentimiento automáticamente.
5. **OE-05** — Ofrecer un chatbot RAG para soporte al cliente con respuestas contextuales del catálogo.
6. **OE-06** — Generar recomendaciones personalizadas basadas en historial de navegación y compras.
7. **OE-07** — Detectar transacciones fraudulentas mediante reglas + ML + LLM (Gemini).
8. **OE-08** — Soportar múltiples monedas (COP por defecto, USD escalable) e idiomas (ES + EN).
9. **OE-09** — Garantizar un pipeline CI/CD automatizado con lint, test y deploy en cada push.
10. **OE-10** — Operar completamente dentro de los límites de servicios gratuitos en la fase MVP.

---

## 3. Alcance MVP

### ✅ Incluido en MVP
- Registro, login, perfil de usuario
- Catálogo con categorías, filtros y búsqueda semántica
- Carrito de compras (persistido en Redis)
- Proceso de checkout y pago con Wompi (sandbox)
- Historial de órdenes
- Sistema de reseñas con moderación IA
- Chatbot de soporte (RAG sobre catálogo)
- Recomendaciones básicas por historial
- Panel de administración (productos, órdenes, usuarios)
- Notificaciones por email (Resend)
- Detección de fraude básica (reglas + LLM)
- Soporte ES + EN (next-intl)
- CI/CD completo (GitHub Actions → Koyeb + Vercel)

### ❌ Fuera del MVP
- App móvil nativa (iOS/Android)
- Marketplace multivendedor
- Suscripciones y pagos recurrentes
- Sistema de cupones/descuentos
- Programa de lealtad/puntos
- Chat en vivo con agente humano
- Integración con ERP/SAP
- Analytics avanzado (BI dashboards)

---

## 4. Actores del Sistema

| Actor | Descripción | Permisos principales |
|-------|-------------|----------------------|
| **Visitante** | Usuario no autenticado | Navegar catálogo, buscar, ver productos, registrarse |
| **Cliente** | Usuario registrado y autenticado | Comprar, reseñar, usar chatbot, ver historial |
| **Administrador** | Gestor del negocio | CRUD productos, gestionar órdenes, ver reportes, moderar reseñas |
| **Sistema IA** | Agente autónomo interno | Moderar reseñas, generar embeddings, detectar fraude, responder chatbot |
| **Sistema Pago** | Wompi (externo) | Procesar transacciones, enviar webhooks de confirmación |

---

## 5. Requerimientos Funcionales

### RF-AUTH — Autenticación y Autorización

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-AUTH-001** | El sistema debe permitir el registro de nuevos usuarios con email, contraseña y nombre | Visitante | Alta |
| **RF-AUTH-002** | El sistema debe validar que el email no esté registrado previamente antes de crear la cuenta | Sistema | Alta |
| **RF-AUTH-003** | El sistema debe hashear la contraseña con bcrypt (cost factor ≥ 12) antes de persistirla | Sistema | Alta |
| **RF-AUTH-004** | El sistema debe permitir el login con email y contraseña, retornando un JWT de acceso (15 min) y uno de refresco (7 días) | Cliente | Alta |
| **RF-AUTH-005** | El sistema debe permitir renovar el token de acceso mediante el token de refresco sin re-login | Cliente | Alta |
| **RF-AUTH-006** | El sistema debe invalidar el token de refresco al cerrar sesión (logout) almacenándolo en lista negra en Redis | Cliente | Alta |
| **RF-AUTH-007** | El sistema debe implementar roles: `customer` y `admin`, controlando el acceso a rutas protegidas | Sistema | Alta |
| **RF-AUTH-008** | El sistema debe enviar un email de bienvenida al completar el registro | Sistema | Media |
| **RF-AUTH-009** | El sistema debe permitir solicitar restablecimiento de contraseña por email con token de un solo uso (TTL: 1h) | Cliente | Media |
| **RF-AUTH-010** | El sistema debe bloquear temporalmente una cuenta tras 5 intentos fallidos de login (bloqueo: 15 min en Redis) | Sistema | Media |

---

### RF-PROD — Gestión de Productos

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-PROD-001** | El administrador debe poder crear productos con: nombre, descripción, precio (COP), stock, categoría, imágenes (hasta 5) y atributos dinámicos (JSONB) | Admin | Alta |
| **RF-PROD-002** | El sistema debe generar automáticamente un embedding vectorial (Gemini text-embedding-004) al crear o actualizar un producto | Sistema IA | Alta |
| **RF-PROD-003** | El administrador debe poder actualizar cualquier campo de un producto existente | Admin | Alta |
| **RF-PROD-004** | El sistema debe manejar soft-delete para productos (campo `deleted_at`), sin borrado físico | Admin | Alta |
| **RF-PROD-005** | El sistema debe gestionar el stock con decremento atómico al confirmar una orden | Sistema | Alta |
| **RF-PROD-006** | El sistema debe notificar al administrador cuando el stock de un producto caiga por debajo de un umbral configurable (por defecto: 5 unidades) | Sistema | Media |
| **RF-PROD-007** | El administrador debe poder gestionar categorías con jerarquía de dos niveles (categoría → subcategoría) | Admin | Alta |
| **RF-PROD-008** | El sistema debe subir imágenes a Supabase Storage y retornar URLs públicas | Sistema | Alta |
| **RF-PROD-009** | El visitante/cliente debe poder ver el detalle completo de un producto | Visitante | Alta |
| **RF-PROD-010** | El sistema debe cachear los listados de productos en Redis (TTL: 5 min) para reducir carga en PostgreSQL | Sistema | Media |

---

### RF-SRCH — Búsqueda y Filtrado

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-SRCH-001** | El sistema debe implementar búsqueda semántica usando pgvector (cosine similarity) con los embeddings de Gemini | Visitante/Cliente | Alta |
| **RF-SRCH-002** | El sistema debe combinar búsqueda semántica y búsqueda full-text mediante Reciprocal Rank Fusion (RRF) para mayor precisión | Sistema IA | Alta |
| **RF-SRCH-003** | El sistema debe retornar resultados de búsqueda en menos de 500ms para el percentil 95 | Sistema | Alta |
| **RF-SRCH-004** | El sistema debe permitir filtrar resultados por: categoría, rango de precio, calificación promedio y disponibilidad en stock | Visitante/Cliente | Alta |
| **RF-SRCH-005** | El sistema debe ordenar resultados por: relevancia (default), precio ascendente/descendente, más reciente, mejor calificado | Visitante/Cliente | Media |
| **RF-SRCH-006** | El sistema debe implementar paginación en los resultados (cursor-based para consistencia) | Sistema | Alta |
| **RF-SRCH-007** | El sistema debe cachear queries de búsqueda frecuentes en Redis (TTL: 2 min) | Sistema | Media |

---

### RF-CART — Carrito de Compras

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-CART-001** | El sistema debe permitir agregar productos al carrito con una cantidad específica | Cliente | Alta |
| **RF-CART-002** | El carrito debe persistirse en Redis asociado al `user_id` (TTL: 7 días) | Sistema | Alta |
| **RF-CART-003** | El sistema debe actualizar la cantidad de un producto en el carrito | Cliente | Alta |
| **RF-CART-004** | El sistema debe eliminar un producto del carrito | Cliente | Alta |
| **RF-CART-005** | El sistema debe vaciar el carrito completo | Cliente | Alta |
| **RF-CART-006** | El sistema debe validar el stock disponible al agregar al carrito y notificar si no hay suficiente | Sistema | Alta |
| **RF-CART-007** | El sistema debe calcular el subtotal, IVA (19%) y total del carrito en tiempo real | Sistema | Alta |
| **RF-CART-008** | El sistema debe fusionar el carrito de invitado (localStorage) con el carrito del usuario al hacer login | Sistema | Media |

---

### RF-ORD — Gestión de Órdenes

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-ORD-001** | El sistema debe crear una orden a partir del carrito activo del cliente durante el checkout | Cliente | Alta |
| **RF-ORD-002** | La orden debe contener: items (producto, cantidad, precio snapshot), dirección de envío, método de pago, estado y timestamps | Sistema | Alta |
| **RF-ORD-003** | El sistema debe manejar los siguientes estados de orden: `pending` → `paid` → `processing` → `shipped` → `delivered` / `cancelled` / `refunded` | Sistema | Alta |
| **RF-ORD-004** | El sistema debe reservar (decrementar) el stock al crear la orden y liberarlo si la orden es cancelada/fallida | Sistema | Alta |
| **RF-ORD-005** | El cliente debe poder ver su historial completo de órdenes con detalle por orden | Cliente | Alta |
| **RF-ORD-006** | El administrador debe poder ver y gestionar todas las órdenes del sistema | Admin | Alta |
| **RF-ORD-007** | El administrador debe poder actualizar manualmente el estado de una orden | Admin | Media |
| **RF-ORD-008** | El sistema debe enviar un email de confirmación al cliente al cambiar el estado de la orden a `paid` | Sistema | Alta |

---

### RF-PAY — Pagos (Wompi)

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-PAY-001** | El sistema debe integrarse con Wompi para procesar pagos en COP mediante tarjeta crédito/débito, PSE y Nequi | Cliente | Alta |
| **RF-PAY-002** | El sistema debe crear una transacción en Wompi con referencia única por orden | Sistema | Alta |
| **RF-PAY-003** | El sistema debe exponer un endpoint de webhook para recibir confirmaciones de pago de Wompi | Sistema | Alta |
| **RF-PAY-004** | El sistema debe validar la firma HMAC-SHA256 de cada webhook recibido antes de procesarlo | Sistema | Alta |
| **RF-PAY-005** | El sistema debe actualizar el estado de la orden al recibir confirmación de pago exitoso | Sistema | Alta |
| **RF-PAY-006** | El sistema debe manejar pagos fallidos y notificar al cliente con el motivo | Sistema | Media |
| **RF-PAY-007** | El sistema debe registrar cada intento de pago en la tabla `payment_transactions` para auditoría | Sistema | Alta |

---

### RF-REV — Reseñas y Calificaciones

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-REV-001** | Un cliente debe poder crear una reseña (calificación 1-5 + texto) únicamente si tiene una orden `delivered` del producto | Cliente | Alta |
| **RF-REV-002** | El sistema debe enviar automáticamente la reseña al asistente IA (Gemini) para análisis de sentimiento y moderación de contenido inapropiado | Sistema IA | Alta |
| **RF-REV-003** | El sistema debe clasificar el sentimiento de la reseña como: `positive`, `neutral` o `negative` | Sistema IA | Alta |
| **RF-REV-004** | El sistema debe rechazar automáticamente reseñas con contenido inapropiado (spam, insultos, contenido adulto) | Sistema IA | Alta |
| **RF-REV-005** | El sistema debe actualizar el promedio de calificación del producto tras cada reseña aprobada | Sistema | Alta |
| **RF-REV-006** | Los visitantes/clientes deben poder leer las reseñas aprobadas de un producto, ordenadas por fecha o utilidad | Visitante | Alta |
| **RF-REV-007** | Un cliente debe poder marcar una reseña como "útil" (una vez por reseña) | Cliente | Baja |
| **RF-REV-008** | El administrador debe poder revisar y gestionar reseñas en estado `pending_review` (cuando la IA no está segura) | Admin | Media |

---

### RF-REC — Recomendaciones Personalizadas

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-REC-001** | El sistema debe generar recomendaciones de productos basadas en el historial de navegación del usuario (últimas 20 páginas visitadas) | Sistema IA | Alta |
| **RF-REC-002** | El sistema debe generar recomendaciones "productos similares" en la página de detalle usando similitud coseno (pgvector) | Sistema IA | Alta |
| **RF-REC-003** | El sistema debe generar recomendaciones "los clientes también compraron" basadas en co-ocurrencia en órdenes | Sistema IA | Media |
| **RF-REC-004** | Para usuarios nuevos (cold start), el sistema debe recomendar los productos mejor calificados y más vendidos | Sistema IA | Media |
| **RF-REC-005** | Las recomendaciones deben cachearse en Redis por usuario (TTL: 1 hora) | Sistema | Media |

---

### RF-CHAT — Chatbot de Soporte (RAG)

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-CHAT-001** | El sistema debe proveer un chatbot que responda preguntas sobre productos, órdenes y políticas de la tienda | Cliente | Alta |
| **RF-CHAT-002** | El chatbot debe usar RAG: recuperar contexto relevante del catálogo (pgvector) e inyectarlo al prompt de Gemini | Sistema IA | Alta |
| **RF-CHAT-003** | Las respuestas del chatbot deben transmitirse en modo streaming (Server-Sent Events) | Sistema IA | Media |
| **RF-CHAT-004** | El chatbot debe mantener contexto de los últimos 10 mensajes de la conversación (almacenado en Redis) | Sistema IA | Media |
| **RF-CHAT-005** | El chatbot debe responder en el idioma del usuario (ES/EN) detectado automáticamente | Sistema IA | Media |
| **RF-CHAT-006** | El chatbot debe usar Gemini Function Calling para consultar stock, precios y estado de órdenes en tiempo real | Sistema IA | Alta |
| **RF-CHAT-007** | El sistema debe registrar las conversaciones del chatbot para análisis y mejora continua | Sistema | Baja |

---

### RF-FRAUD — Detección de Fraude

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-FRAUD-001** | El sistema debe evaluar cada transacción de pago con un pipeline de 3 niveles: reglas → ML heurístico → Gemini LLM | Sistema IA | Alta |
| **RF-FRAUD-002** | Las reglas de nivel 1 deben incluir: múltiples órdenes en <5 min, dirección/IP nueva + monto alto, intentos de pago fallidos repetidos | Sistema IA | Alta |
| **RF-FRAUD-003** | El sistema debe asignar un score de riesgo (0.0 - 1.0) a cada transacción | Sistema IA | Alta |
| **RF-FRAUD-004** | Transacciones con score ≥ 0.8 deben bloquearse automáticamente y notificar al administrador | Sistema IA | Alta |
| **RF-FRAUD-005** | Transacciones con score 0.5 - 0.79 deben marcarse para revisión manual del administrador | Sistema IA | Alta |
| **RF-FRAUD-006** | El administrador debe poder aprobar o rechazar transacciones marcadas para revisión | Admin | Media |
| **RF-FRAUD-007** | El sistema debe registrar todos los eventos de fraude detectado en una tabla de auditoría | Sistema | Alta |

---

### RF-NOT — Notificaciones

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-NOT-001** | El sistema debe enviar emails transaccionales vía Resend para: bienvenida, confirmación de orden, cambio de estado de orden, reseteo de contraseña | Sistema | Alta |
| **RF-NOT-002** | Los emails deben usar plantillas HTML responsivas con la identidad visual de la tienda | Sistema | Media |
| **RF-NOT-003** | El sistema debe reintentar el envío de emails fallidos hasta 3 veces con backoff exponencial | Sistema | Media |

---

### RF-ADMIN — Panel de Administración

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-ADMIN-001** | El administrador debe acceder a un panel protegido con su propio layout y rutas | Admin | Alta |
| **RF-ADMIN-002** | El panel debe mostrar métricas del dashboard: ventas del día, órdenes pendientes, productos con bajo stock, reseñas pendientes | Admin | Alta |
| **RF-ADMIN-003** | El administrador debe poder gestionar (CRUD) productos y categorías | Admin | Alta |
| **RF-ADMIN-004** | El administrador debe poder ver y actualizar el estado de todas las órdenes | Admin | Alta |
| **RF-ADMIN-005** | El administrador debe poder ver la lista de usuarios registrados | Admin | Media |
| **RF-ADMIN-006** | El administrador debe poder moderar reseñas pendientes (aprobar/rechazar) | Admin | Media |
| **RF-ADMIN-007** | El administrador debe poder revisar alertas de fraude y gestionar transacciones sospechosas | Admin | Alta |

---

### RF-I18N — Internacionalización

| ID | Requerimiento | Actor | Prioridad |
|----|--------------|-------|-----------|
| **RF-I18N-001** | La interfaz de usuario debe estar disponible en español (ES) e inglés (EN) usando next-intl | Visitante/Cliente | Media |
| **RF-I18N-002** | Los precios deben mostrarse en COP con formato colombiano (ej: $1.250.000) por defecto | Sistema | Alta |
| **RF-I18N-003** | El sistema debe soportar la conversión de divisas COP → USD bajo demanda (tasa actualizable desde admin) | Sistema | Baja |
| **RF-I18N-004** | Las fechas deben mostrarse en el formato local del usuario | Sistema | Baja |

---

## 6. Requerimientos No Funcionales

### RNF-PERF — Rendimiento

| ID | Requerimiento | Métrica |
|----|--------------|---------|
| **RNF-PERF-001** | El API debe responder en menos de 200ms (p95) para endpoints sin IA | p95 < 200ms |
| **RNF-PERF-002** | Los endpoints de búsqueda semántica deben responder en menos de 500ms (p95) | p95 < 500ms |
| **RNF-PERF-003** | El frontend debe obtener un score LCP ≤ 2.5s en Core Web Vitals | LCP ≤ 2.5s |
| **RNF-PERF-004** | El sistema debe soportar al menos 100 usuarios concurrentes en MVP sin degradación | ≥ 100 concurrent users |
| **RNF-PERF-005** | El tiempo de carga inicial del frontend (FCP) no debe superar 1.5s en conexión 4G | FCP ≤ 1.5s |

---

### RNF-SEC — Seguridad

| ID | Requerimiento | Referencia |
|----|--------------|------------|
| **RNF-SEC-001** | Todas las contraseñas deben hashearse con bcrypt, cost factor ≥ 12 | OWASP A02 |
| **RNF-SEC-002** | Todos los endpoints deben validar y sanitizar los inputs de entrada (Pydantic v2) | OWASP A03 |
| **RNF-SEC-003** | El API debe implementar rate limiting: 100 req/min por IP en endpoints públicos, 20 req/min en auth | OWASP A04 |
| **RNF-SEC-004** | Todas las comunicaciones deben realizarse sobre HTTPS (TLS 1.2+) | OWASP A05 |
| **RNF-SEC-005** | Los JWTs deben firmarse con RS256 y tener TTL corto (access: 15 min, refresh: 7 días) | OWASP A07 |
| **RNF-SEC-006** | El frontend debe implementar CSP (Content Security Policy) headers estrictos | OWASP A05 |
| **RNF-SEC-007** | Las variables de entorno sensibles nunca deben commitearse al repositorio (`.env` en `.gitignore`) | OWASP A02 |
| **RNF-SEC-008** | El webhook de Wompi debe validar la firma HMAC-SHA256 antes de procesar cualquier evento | OWASP A08 |
| **RNF-SEC-009** | Los logs nunca deben contener contraseñas, tokens JWT completos, ni datos de tarjetas | OWASP A09 |
| **RNF-SEC-010** | El sistema debe implementar protección CSRF en formularios del frontend | OWASP A01 |

---

### RNF-DISP — Disponibilidad

| ID | Requerimiento | Métrica |
|----|--------------|---------|
| **RNF-DISP-001** | El sistema debe estar disponible al menos el 99% del tiempo mensual | ≥ 99% uptime |
| **RNF-DISP-002** | El backend en Koyeb debe mantenerse siempre activo (no sleep) | Always ON |
| **RNF-DISP-003** | El sistema debe manejar graceful shutdown para no perder transacciones en vuelo durante deploys | 0 lost transactions |
| **RNF-DISP-004** | Las migraciones de BD deben ejecutarse sin downtime (migraciones compatibles hacia atrás) | Zero-downtime migrations |

---

### RNF-ESC — Escalabilidad

| ID | Requerimiento | Métrica |
|----|--------------|---------|
| **RNF-ESC-001** | La arquitectura debe permitir escalar horizontalmente el backend sin cambios de código (stateless) | Stateless API |
| **RNF-ESC-002** | El sistema debe soportar hasta 5,000 productos en MVP sin degradación de búsqueda vectorial | ≤ 5K productos |
| **RNF-ESC-003** | El diseño de BD debe usar índices apropiados (B-tree + IVFFlat para pgvector) desde el inicio | Indexed queries |
| **RNF-ESC-004** | El sistema de caché (Redis) debe ser fácilmente reemplazable por Redis Cluster sin cambios de lógica | Abstraction layer |

---

### RNF-MANT — Mantenibilidad

| ID | Requerimiento | Estándar |
|----|--------------|---------|
| **RNF-MANT-001** | El código debe seguir Clean Architecture con separación estricta de capas | Clean Architecture |
| **RNF-MANT-002** | El backend debe mantener cobertura de tests ≥ 80% en capa de dominio y casos de uso | ≥ 80% coverage |
| **RNF-MANT-003** | El código Python debe pasar linting con `ruff` sin errores | Ruff clean |
| **RNF-MANT-004** | El código TypeScript debe pasar verificación de tipos (`tsc --noEmit`) sin errores | Type-safe |
| **RNF-MANT-005** | El API debe estar documentado automáticamente con OpenAPI/Swagger (FastAPI built-in) | OpenAPI 3.0 |
| **RNF-MANT-006** | Las migraciones de BD deben versionarse con Alembic y ser reproducibles | Alembic migrations |

---

### RNF-USAB — Usabilidad

| ID | Requerimiento | Estándar |
|----|--------------|---------|
| **RNF-USAB-001** | El diseño debe ser responsivo y funcionar en móvil, tablet y desktop (mobile-first) | Responsive design |
| **RNF-USAB-002** | El formulario de checkout no debe tener más de 3 pasos | ≤ 3 steps checkout |
| **RNF-USAB-003** | El sistema debe mostrar feedback visual claro para todas las acciones del usuario (loading, error, success) | UX feedback |
| **RNF-USAB-004** | Los mensajes de error deben ser comprensibles por el usuario final (sin jerga técnica) | User-friendly errors |
| **RNF-USAB-005** | El sistema debe cumplir con criterios básicos de accesibilidad WCAG 2.1 nivel AA | WCAG 2.1 AA |

---

### RNF-PORT — Portabilidad

| ID | Requerimiento | Herramienta |
|----|--------------|------------|
| **RNF-PORT-001** | El backend debe ejecutarse idénticamente en local y en producción usando Docker | Docker |
| **RNF-PORT-002** | El entorno local debe levantarse con un solo comando: `docker compose up` | Docker Compose |
| **RNF-PORT-003** | Todas las variables de configuración deben provenir de variables de entorno (12-factor app) | 12-Factor |

---

### RNF-AI — Inteligencia Artificial

| ID | Requerimiento | Límite |
|----|--------------|--------|
| **RNF-AI-001** | El sistema debe respetar el límite de 1,500 requests/día de Gemini API con un sistema de cuotas interno | 1,500 req/día |
| **RNF-AI-002** | Las llamadas a Gemini deben tener timeout de 10s y manejo de fallback (respuesta degradada sin IA) | 10s timeout |
| **RNF-AI-003** | Los embeddings de productos deben generarse de forma asíncrona (background task) para no bloquear el request principal | Async background |
| **RNF-AI-004** | El sistema de RAG del chatbot debe limitar el contexto a los 5 fragmentos más relevantes para no exceder el token limit | Top-5 RAG |
| **RNF-AI-005** | Todas las respuestas de IA deben loguearse con el prompt enviado y la respuesta recibida para auditoría y mejora | AI audit log |

---

## 7. Restricciones Técnicas (Free Tier)

| Servicio | Límite | Estrategia de mitigación |
|---------|--------|--------------------------|
| Supabase PostgreSQL | 500MB storage | Limpiar embeddings de productos eliminados; JSONB compacto |
| Redis Cloud | 30MB RAM | TTLs agresivos; solo cachear lo crítico |
| Gemini API | 1,500 req/día | Cuota interna; cache de embeddings; fallback sin IA |
| Koyeb | 512MB RAM | Optimizar workers uvicorn; no cargar modelos en memoria |
| Vercel | 100GB bandwidth/mes | Imágenes optimizadas (next/image); CDN para assets |
| Resend | 100 emails/día | Solo emails transaccionales críticos; no marketing |
| Supabase Storage | 1GB | Comprimir imágenes antes de subir; máx 5 imágenes/producto |

---

## 8. Criterios de Aceptación del MVP

El MVP se considera completo cuando:

- [ ] Un visitante puede registrarse, buscar un producto y completar una compra (flujo end-to-end)
- [ ] El pago con Wompi sandbox funciona con al menos PSE y tarjeta crédito
- [ ] La búsqueda semántica retorna resultados relevantes con latencia < 500ms
- [ ] El asistente de reseñas aprueba/rechaza reseñas automáticamente con precisión > 85%
- [ ] El chatbot responde preguntas sobre el catálogo de forma coherente en ES y EN
- [ ] El pipeline CI/CD ejecuta lint + tests + deploy en cada push a `main`
- [ ] El administrador puede gestionar productos, órdenes y reseñas desde el panel
- [ ] La aplicación obtiene ≥ 85 en Lighthouse (Performance, Accessibility, Best Practices)
- [ ] El sistema detecta y bloquea al menos los casos de fraude obvios (reglas nivel 1)
- [ ] Todos los endpoints del API están documentados en Swagger

---

*Documento generado como parte del proceso de documentación previo a la Fase 1 de implementación.*
