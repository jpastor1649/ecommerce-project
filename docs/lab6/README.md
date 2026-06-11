# Lab 6 — Reliability (2026-I)
## Cluster Pattern + Redundancy Pattern

**Curso:** Arquitectura de Software · 2026-I  
**Profesor:** Santiago Suárez Suárez  

---

## 1. Información del Equipo

| # | Nombre completo |
|---|----------------|
| 1 | Sara Isabel Ospina Valderrama |
| 2 | Andrés Felipe Perdomo Uruburu |
| 3 | Juan David Castañeda Cárdenas |
| 4 | John Alejandro Pastor Sandoval |

---

## 2. Vista Arquitectónica

### 2.1 Cluster Pattern — Vista de Despliegue Kubernetes

El siguiente diagrama muestra cómo el `auth-service` fue desplegado como un Kubernetes Deployment con 2 réplicas dentro de un clúster local (Minikube), junto con sus dependencias internas (PostgreSQL y Redis).

```
┌─────────────────────────────────────────────────────────────────┐
│                    Minikube Cluster                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Kubernetes Control Plane                    │   │
│  │         (Scheduler · API Server · etcd)                  │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │ manages                           │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │                    default namespace                     │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │         Deployment: auth-service (replicas: 2)  │   │   │
│  │  │                                                 │   │   │
│  │  │  ┌──────────────┐    ┌──────────────┐          │   │   │
│  │  │  │   Pod #1     │    │   Pod #2     │          │   │   │
│  │  │  │ auth-service │    │ auth-service │          │   │   │
│  │  │  │  :8001       │    │  :8001       │          │   │   │
│  │  │  └──────┬───────┘    └──────┬───────┘          │   │   │
│  │  └─────────┼────────────────────┼─────────────────┘   │   │
│  │            │                    │                       │   │
│  │  ┌─────────▼────────────────────▼─────────────────┐   │   │
│  │  │     Service: auth-service-svc (NodePort:30801)  │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌──────────────────┐   ┌──────────────────┐           │   │
│  │  │ Deployment:      │   │ Deployment:       │           │   │
│  │  │ auth-postgres    │   │ auth-redis        │           │   │
│  │  │ (replicas: 1)    │   │ (replicas: 1)     │           │   │
│  │  │ Service: :5432   │   │ Service: :6379    │           │   │
│  │  └──────────────────┘   └──────────────────┘           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    NodePort: 30801
                              │
                    ┌─────────▼──────────┐
                    │   Host Machine     │
                    │  (localhost:30801) │
                    └────────────────────┘
```
### 2.2 Cold Cold Redundancy - Vista de Componentes y conectores

![Vista de Componentes y Conectores](img/CyCLab6.drawio.png)
---

## 3. Guía Técnica — Parte A: Cluster Pattern

### 3.1 Descripción del Patrón

El **Cluster Pattern** agrupa múltiples nodos para que actúen como un único sistema lógico. Kubernetes implementa este patrón organizando contenedores en **Pods**, agrupando Pods en **Deployments**, y exponiéndolos a través de **Services**. Esto proporciona:

- **Self-healing:** Kubernetes detecta pods caídos y los recrea automáticamente.
- **Escalado:** El número de réplicas se puede ajustar en tiempo real.
- **Load balancing:** El tráfico se distribuye entre todas las réplicas disponibles.

**Tácticas de confiabilidad que soporta:**
- Fault Detection (liveness y readiness probes)
- Redundant Spare (múltiples réplicas activas)
- Load Balancing (distribución automática de tráfico)

### 3.2 Tipo de Clúster Implementado

Se implementó un clúster **Active/Active**, donde todos los nodos (réplicas) procesan tráfico simultáneamente. Esto se eligió porque el `auth-service` es un servicio **stateless** — cada réplica puede atender cualquier petición sin depender del estado de las demás, ya que la sesión se almacena en Redis.

### 3.3 Componente Desplegado

**auth-service** — Servicio de autenticación (FastAPI/Python 3.12)
- Puerto interno: `8001`
- Réplicas mínimas: `2`
- Dependencias: PostgreSQL (auth_db), Redis (sesiones JWT)

Se eligió este componente porque es **stateless**, lo que facilita la replicación horizontal sin riesgo de inconsistencias de estado entre pods.

### 3.4 Pasos de Implementación

#### Paso 1 — Iniciar Minikube

```bash
minikube start --driver=docker
```

#### Paso 2 — Apuntar Docker al daemon de Minikube y construir la imagen

```bash
eval $(minikube docker-env)
docker build -t ecommerce-project-auth-service:latest \
  -f backend/auth_service/Dockerfile ./backend
```

> ⚠️ `imagePullPolicy: Never` en el Deployment asegura que Kubernetes use la imagen local construida dentro de Minikube.

#### Paso 3 — Crear los manifiestos Kubernetes

Los manifiestos están en la carpeta `k8s/`:

```
k8s/
├── auth-deployment.yaml   # Deployment del auth-service (2 réplicas)
├── auth-service.yaml      # Service NodePort expuesto en :30801
└── auth-postgres.yaml     # PostgreSQL + Redis internos del clúster
```

#### Paso 4 — Aplicar los manifiestos

```bash
kubectl apply -f k8s/auth-postgres.yaml
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/auth-service.yaml
```

#### Paso 5 — Verificar el despliegue

```bash
kubectl get pods
kubectl get svc
```

**Salida esperada:**
```
NAME                            READY   STATUS    RESTARTS   AGE
auth-postgres-8d5db755f-9x6gp   1/1     Running   0          5m
auth-redis-89d444447-gk2c5      1/1     Running   0          5m
auth-service-577859fc9c-h5j55   1/1     Running   0          5m
auth-service-577859fc9c-pskc7   1/1     Running   0          5m
```

### 3.5 Snippets de Configuración

#### `k8s/auth-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  labels:
    app: auth-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: ecommerce-project-auth-service:latest
          imagePullPolicy: Never
          ports:
            - containerPort: 8001
          env:
            - name: DATABASE_URL
              value: "postgresql+asyncpg://auth_user:auth_password@auth-postgres:5432/auth_db"
            - name: REDIS_URL
              value: "redis://auth-redis:6379/0"
            - name: JWT_SECRET
              value: "replace_with_a_secure_secret_min_32_chars!!"
            - name: RABBITMQ_HOST
              value: "localhost"
          livenessProbe:
            httpGet:
              path: /health
              port: 8001
            initialDelaySeconds: 20
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /health
              port: 8001
            initialDelaySeconds: 15
            periodSeconds: 10
```

#### `k8s/auth-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: auth-service-svc
spec:
  type: NodePort
  selector:
    app: auth-service
  ports:
    - port: 80
      targetPort: 8001
      nodePort: 30801
```

**Adaptaciones específicas del proyecto:**
- `imagePullPolicy: Never` para usar imagen local de Minikube.
- Variables de entorno ajustadas al naming del `auth-service` (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`).
- PostgreSQL y Redis desplegados dentro del clúster para evitar dependencias externas.
- Liveness y Readiness probes apuntando al endpoint `/health` del auth-service.

### 3.6 Evidencia de Self-Healing

Se eliminó manualmente un pod y Kubernetes lo recreó automáticamente para mantener las 2 réplicas:

```bash
# Eliminar un pod manualmente
kubectl delete pod auth-service-577859fc9c-9csm8

# Observar recreación automática
kubectl get pods --watch
```

**Salida observada:**
```
NAME                            READY   STATUS        RESTARTS   AGE
auth-service-577859fc9c-9csm8   0/1     Terminating   4          3m42s
auth-service-577859fc9c-h5j55   1/1     Running       0          3m42s
auth-service-577859fc9c-pskc7   0/1     Running       0          2s      ← nuevo pod
auth-service-577859fc9c-pskc7   1/1     Running       0          26s     ← listo
```

Kubernetes detectó que el número de réplicas cayó a 1 y creó un nuevo pod (`pskc7`) automáticamente en segundos.

### 3.7 Evidencia de Escalado

```bash
# Escalar a 4 réplicas
kubectl scale deployment auth-service --replicas=4

# Verificar
kubectl get pods
```

**Salida observada:**
```
NAME                            READY   STATUS              RESTARTS   AGE
auth-postgres-8d5db755f-9x6gp   1/1     Running             0          5m12s
auth-redis-89d444447-gk2c5      1/1     Running             0          5m12s
auth-service-577859fc9c-7nfvh   0/1     ContainerCreating   0          0s    ← nuevo
auth-service-577859fc9c-h5j55   1/1     Running             0          3m19s
auth-service-577859fc9c-ps5l4   0/1     ContainerCreating   0          0s    ← nuevo
auth-service-577859fc9c-pskc7   1/1     Running             0          92s
```

El clúster pasó de 2 a 4 réplicas sin interrumpir el servicio.

---

## 4. Pull Request

> Link al PR: https://github.com/jpastor1649/ecommerce-project/pull/26

---

*Lab 6 — Arquitectura de Software 2026-I · Grupo D · Universidad Nacional de Colombia*
