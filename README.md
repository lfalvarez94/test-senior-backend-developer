# Flows Service

**Backend** implementado con NestJS, Prisma y Arquitectura Hexagonal, desplegado como AWS Lambda con Serverless Framework.

---

## Tabla de contenido

- [Descripción](#descripción)
- [Modelo de datos](#modelo-de-datos)
- [Arquitectura](#arquitectura)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
  - [Variables de entorno](#variables-de-entorno)
  - [Migraciones de Prisma](#migraciones-de-prisma)
- [Ejecución local](#ejecución-local)
- [Despliegue (Serverless)](#despliegue-serverless)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Endpoints disponibles](#endpoints-disponibles)
- [Procesamiento de etapas](#procesamiento-de-etapas)
- [Validaciones](#validaciones)
---

## Descripción

Servicio para definir y ejecutar **Flows** compuestos de múltiples **Stages** (pop-ups, formularios, emails, delays, cupones, tickets).

---

## Modelo de datos

<img width="1067" height="882" alt="image" src="https://github.com/user-attachments/assets/9343d8b1-1bd0-47fb-9739-aa97665c0131" />



---

## Arquitectura



Se sigue el patrón de **Hexagonal Architecture** para desacoplar dominio de infraestructuras:

```plaintext
      +----------------------+       Adaptadores externos   
      |   API Layer (Nest)   |<---------------------------+
      +----------+-----------+                            |
                 |                                        |
       +---------v---------+        +----------------+    |
       | Application Layer |<------>| Messaging (SNS)|    |
       +---------+---------+        +----------------+    |
                 |                                        |
       +---------v---------+        +---------------+     |
       |   Domain Layer    |<-----> | Persistence   |     |
       +---------+---------+        | (Prisma / RDS)|     |
                 |                  +---------------+     |
       +---------v---------+        +---------------+     |
       | Infrastructure    |<-----> | SES, S3, SQS, |     |
       | (Adapters)        |        | Stripe, etc.  |     |
       +-------------------+                              |
                                                          |
      +---------------------------------------------------+
```

- **API Layer**: NestJS Controllers / Lambda handlers
- **Application Layer**: Casos de uso (Use Cases)
- **Domain Layer**: Entidades, Enums, Value Objects
- **Infrastructure Adapters**: Prisma, SNS, SQS, SES, S3, Stripe

- <img width="1106" height="877" alt="image" src="https://github.com/user-attachments/assets/10b3f6b9-b130-46a0-9956-2ce41ca90c18" />


---

## Requisitos previos

- Node.js ≥ 16
- npm o yarn
- AWS CLI configurado (credenciales)
- Cuenta AWS con permisos para Lambda, API Gateway, SNS, SQS, SES, S3
- Cuenta Stripe (clave secreta)

---

## Instalación y configuración

```bash
git clone 
npm install
npx prisma generate
```

### Variables de entorno

Crea `.env` en la raíz con:

```dotenv
DATABASE_URL=postgresql://user:pass@host:5432/db
SNS_STAGE_READY_ARN=arn:aws:sns:...:StageReady
SNS_STAGE_COMPLETED_ARN=arn:aws:sns:...:StageCompleted
SQS_DELAY_QUEUE_URL=https://sqs.../DelayQueue
S3_BUCKET=my-app-assets
STRIPE_SECRET_KEY=sk_test_...
```
---

### Migraciones de Prisma

```bash
npx prisma migrate dev --name init
```

---

## Ejecución local

```bash
npm run start:dev   # NestJS local
npx serverless offline   # SNS/SQS/API Gateway local
```

---

## Despliegue (Serverless)

```bash
npm run build
npx serverless deploy
```

---

## Estructura de carpetas

```
src/
├─ domain/           Entidades, enums, value objects, interfaces
├─ application/      DTOs, interfaces, casos de uso
├─ infrastructure/   Adaptadores (Prisma, SNS, etc.)
├─ apps/     Controllers, módulos, Lambdas
```

---

## Endpoints disponibles

### Flows

| Método | Ruta             | Descripción               |
| ------ | ---------------- | ------------------------- |
| GET    | `/flows`         | Listar flows              |
| POST   | `/flows`         | Crear flow                |
| GET    | `/flows/:id`     | Detalle de flow           |
| PUT    | `/flows/:id`     | Actualizar flow           |
| DELETE | `/flows/:id`     | Eliminar flow             |
| POST   | `/flows/:id/run` | Iniciar ejecución de flow |

### Stages

| Método | Ruta                             | Descripción      |
| ------ | -------------------------------- | ---------------- |
| GET    | `/flows/:flowId/stages`          | Listar etapas    |
| POST   | `/flows/:flowId/stages`          | Crear etapa      |
| GET    | `/flows/:flowId/stages/:stageId` | Obtener etapa    |
| PUT    | `/flows/:flowId/stages/:stageId` | Actualizar etapa |
| DELETE | `/flows/:flowId/stages/:stageId` | Eliminar etapa   |

---

## Procesamiento de etapas

1. **RunFlowUseCase** crea `FlowExecution` y `StageExecution`.
2. Publica evento **StageReady** a SNS.
3. **Lambda processStage** recibe, ejecuta y publica **StageCompleted**.
4. Orquesta siguiente etapa o finaliza.

---

## Validaciones

1. **Orden único**: no duplicar `order` en stages del mismo flow.
2. **EMAIL**: requiere un `POPUP_FORM` previo con campo `email`.

---

