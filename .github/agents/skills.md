# 🧠 Skills del Equipo — E-commerce Colombia

> Archivo de referencia para el Arquitecto/Mentor.
> Calibra la profundidad de explicaciones y el nivel de abstracción del código generado.

---

## 👤 Perfil del Desarrollador Principal

| Aspecto | Detalle |
|--------|---------|
| **Rol** | Líder técnico + desarrollador principal |
| **Modalidad** | 1 persona (arquitectar como equipo de 4-5) |
| **Tipo de proyecto** | Académico con estándares de producción |
| **Objetivo de aprendizaje** | Construir e-commerce enterprise-grade entendiendo cada decisión |

---

## 🐍 Python

| Área | Nivel | Notas |
|------|-------|-------|
| Sintaxis general | ⭐⭐⭐ Intermedio | Funciones, clases, módulos |
| POO | ⭐⭐⭐ Intermedio | Herencia, encapsulamiento |
| `async/await` | ⭐⭐ Básico-Intermedio | Conoce el concepto, aprendiendo |
| FastAPI | ⭐⭐ Aprendiendo | Conoce lo básico, necesita guía |
| Pydantic v2 | ⭐ Aprendiendo | Nuevo para el proyecto |
| SQLAlchemy 2.0 | ⭐ Aprendiendo | ORM nuevo para el proyecto |
| Alembic | ⭐ Aprendiendo | Migraciones, concepto nuevo |
| `redis-py` async | ⭐ Aprendiendo | Redis en general, nuevo |
| Pytest | ⭐⭐ Básico | Tests simples, aprendiendo mocking |
| Manejo de errores | ⭐⭐ Básico | Try/except, aprendiendo custom exceptions |

**Instrucción para el mentor:** Explicar decoradores, type hints y async step-by-step. No asumir conocimiento de ORM.

---

## 🌐 JavaScript / TypeScript

| Área | Nivel | Notas |
|------|-------|-------|
| JavaScript ES6+ | ⭐⭐ Básico | Arrow functions, destructuring, promises |
| TypeScript | ⭐ Aprendiendo | Tipos básicos, aprendiendo interfaces |
| React | ⭐⭐ Básico | Componentes funcionales, useState, useEffect |
| Next.js | ⭐⭐ Básico | Pages router conocido, App Router aprendiendo |
| Tailwind CSS | ⭐⭐ Básico | Clases utilitarias básicas |
| shadcn/ui | ⭐ Aprendiendo | Nuevo para el proyecto |
| Zustand | ⭐ Aprendiendo | Redux conoce concepto, Zustand nuevo |
| TanStack Query | ⭐ Aprendiendo | Concepto de cache de queries, nuevo |

**Instrucción para el mentor:** Explicar diferencia Client/Server Components en Next.js App Router. Mostrar TypeScript gradualmente.

---

## 🗄️ Bases de Datos

| Área | Nivel | Notas |
|------|-------|-------|
| SQL general | ⭐⭐⭐ Intermedio | SELECT, JOIN, WHERE, GROUP BY |
| PostgreSQL | ⭐⭐ Básico | Sabe usarlo, aprendiendo features avanzadas |
| pgvector | ⭐ Aprendiendo | Concepto de vectores, nuevo |
| Redis | ⭐ Aprendiendo | Concepto de cache, nuevo en implementación |
| Diseño ER | ⭐⭐ Básico | Tablas, relaciones, llaves foráneas |
| Índices | ⭐ Aprendiendo | Concepto básico, aprendiendo optimización |
| Transacciones | ⭐ Aprendiendo | Concepto ACID, nuevo en práctica |

**Instrucción para el mentor:** Explicar cada decisión de diseño ER. Mostrar por qué se indexa cada columna.

---

## 🐳 DevOps / Infraestructura

| Área | Nivel | Notas |
|------|-------|-------|
| Docker | ⭐⭐ Básico | `docker run`, imágenes/contenedores |
| Docker Compose | ⭐ Aprendiendo | Concepto, aprendiendo con el proyecto |
| GitHub Actions | ⭐ Aprendiendo | Concepto CI/CD, nuevo en configuración |
| Git / Git Flow | ⭐⭐⭐ Intermedio | Commits, branches, PRs |
| Linux CLI | ⭐⭐ Básico | Comandos básicos, navegación |
| Variables de entorno | ⭐⭐ Básico | Sabe qué son, aprendiendo gestión segura |
| Nginx | ⭐ Conceptual | Solo teórico |

**Instrucción para el mentor:** Explicar cada directiva del Dockerfile y docker-compose.yml línea por línea.

---

## 🔐 Seguridad

| Área | Nivel | Notas |
|------|-------|-------|
| Hashing contraseñas | ⭐⭐ Básico | Sabe que existe bcrypt |
| JWT | ⭐⭐ Básico | Sabe qué es, aprendiendo implementación |
| OWASP Top 10 | ⭐ Conceptual | Conoce los conceptos básicos |
| SQL Injection | ⭐⭐ Básico | Sabe el riesgo, aprendiendo prevención via ORM |
| CORS | ⭐⭐ Básico | Sabe qué es, aprendiendo configuración |
| Rate Limiting | ⭐ Conceptual | Sabe que existe |
| Prompt Injection (IA) | ⭐ Aprendiendo | Nuevo con este proyecto |

---

## 🤖 Inteligencia Artificial

| Área | Nivel | Notas |
|------|-------|-------|
| Conceptos LLM | ⭐⭐ Básico | Sabe qué es GPT, Gemini |
| Embeddings | ⭐ Conceptual | Sabe que existen para búsqueda |
| RAG | ⭐ Conceptual | Concepto visto, nunca implementado |
| Gemini API | ⭐ Aprendiendo | Nuevo para el proyecto |
| Function Calling | ⭐ Aprendiendo | Nuevo para el proyecto |
| pgvector | ⭐ Aprendiendo | Nuevo para el proyecto |
| Prompt Engineering | ⭐ Aprendiendo | Básico |

---

## 📐 Arquitectura de Software

| Área | Nivel | Notas |
|------|-------|-------|
| Clean Architecture | ⭐ Conceptual | Visto en teoría, primer proyecto práctico |
| SOLID | ⭐⭐ Básico | Conoce los principios |
| API REST | ⭐⭐ Básico | Sabe consumir APIs, aprendiendo diseño |
| Patrones de diseño | ⭐ Conceptual | Repository, Factory — conceptuales |
| Microservicios | ⭐ Conceptual | Teoría, este proyecto es monolito |
| Event-driven | ⭐ Conceptual | Conoce el concepto |

---

## 📋 Guía de Calibración para el Mentor

```
NIVEL 1 (⭐) → Explicar desde cero con analogías simples
NIVEL 2 (⭐⭐) → Explicar el "por qué" antes del código
NIVEL 3 (⭐⭐⭐) → Código directo con comentarios clave

REGLAS:
→ Siempre mostrar el código COMPLETO (no "...el resto igual")
→ Explicar cada import que se use por primera vez
→ Usar analogías del mundo real para conceptos abstractos
→ Mostrar el output esperado de cada comando
→ Anticipar errores comunes del nivel del desarrollador
```

---
*Actualizado: 2026-03-13*
