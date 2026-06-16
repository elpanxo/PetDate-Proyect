# PetDate

PetDate es una plataforma web para la gestión de mascotas y servicios veterinarios. Centraliza la búsqueda de veterinarias, urgencias 24/7, tiendas y otros servicios relacionados, y permite a los usuarios administrar la información y cuidados de sus mascotas en un solo lugar.

---

## Equipo de desarrollo

| Nombre | Rol |
|---|---|
| Camila González | Scrum Master |
| Francisco Agüero | Desarrollador Frontend |
| Eliecer Salgado | Desarrollador Backend |

---

## Arquitectura del proyecto

El proyecto implementa una arquitectura de microservicios con un frontend React desacoplado. Toda la comunicación del cliente pasa por un API Gateway centralizado.

```
PetDate-Proyect/
├── Proyecto/
│   ├── Frontend/               # React 19 + Vite
│   ├── Backend/
│   │   ├── api-gateway/        # :8080 — Enrutamiento y validación JWT
│   │   ├── ms-usuarios/        # :8081 — Usuarios y autenticación
│   │   ├── ms-mascotas/        # :8082 — Gestión de mascotas
│   │   ├── ms-servicios/       # :8083 — Servicios, promociones y blogs
│   │   ├── ms-citas-medicas/   # :8084 — Citas veterinarias
│   │   ├── ms-comentarios/     # :8085 — Comentarios y contacto
│   │   └── docker-compose.yml
│   └── Data/
│       ├── docker-compose.yml  # MongoDB, Nginx imagen-server, backups
│       └── nginx/
├── Documentación/
├── Gestión/
└── README.md
```

### Diagrama de servicios

```
Cliente (React)
      │
      ▼
API Gateway :8080
      │
      ├──► ms-usuarios     :8081  (MongoDB)
      ├──► ms-mascotas     :8082  (MongoDB)
      ├──► ms-servicios    :8083  (MongoDB)
      ├──► ms-citas-medicas :8084 (MongoDB)
      ├──► ms-comentarios  :8085  (MongoDB)
      └──► imagen-server   :80    (Nginx)
```

---

## Microservicios

| Servicio | Puerto | Descripción | README |
|---|---|---|---|
| api-gateway | 8080 | Enrutamiento, JWT, auditoría | [ver](Proyecto/Backend/api-gateway/README.md) |
| ms-usuarios | 8081 | Registro, login, perfiles | [ver](Proyecto/Backend/ms-usuarios/README.md) |
| ms-mascotas | 8082 | CRUD mascotas e imágenes | [ver](Proyecto/Backend/ms-mascotas/README.md) |
| ms-servicios | 8083 | Servicios, promociones, blogs | [ver](Proyecto/Backend/ms-servicios/README.md) |
| ms-citas-medicas | 8084 | Agendamiento de citas | [ver](Proyecto/Backend/ms-citas-medicas/README.md) |
| ms-comentarios | 8085 | Reseñas y formulario de contacto | [ver](Proyecto/Backend/ms-comentarios/README.md) |
| Frontend | — | Aplicación web React | [ver](Proyecto/Frontend/README.md) |

---

## Stack tecnológico

**Backend**
- Java 17 + Spring Boot 4
- Spring Cloud Gateway
- Spring Security + JWT (JJWT 0.12.6)
- Spring Mail
- OpenFeign (comunicación inter-servicios)
- MongoDB 7.0
- Swagger / OpenAPI 2.8.8
- Maven 3.9.6

**Frontend**
- React 19 + Vite 8
- React Router DOM 7
- Bootstrap 5 + React Bootstrap 2
- Lucide React

**Infraestructura**
- Docker + Docker Compose
- Nginx (servidor de imágenes)
- Backups automáticos de MongoDB

---

## Seguridad

- **JWT**: El API Gateway valida cada petición. Extrae `usuarioId` y `rol` (ADMIN, USER, SERVICIO) e inyecta los headers `X-Usuario-Id` y `X-Usuario-Rol` hacia los servicios downstream.
- **Roles**: `ADMIN` tiene acceso total; `USER` accede solo a sus propios recursos; `SERVICIO` gestiona su propia empresa.
- **Auditoría**: El API Gateway registra cada operación en MongoDB. Consulta disponible en `/auditoria` (solo ADMIN).
- **Recuperación de contraseña**: Código de 6 dígitos enviado al correo, de un solo uso con expiración.
- **Privacidad**: Cumplimiento de la Ley 19.628 (protección de datos personales, Chile).

---

## Instalación y ejecución

### Prerrequisitos

- Java 17
- Maven 3.9+
- Node.js 18+
- Docker y Docker Compose

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd PetDate-Proyect
```

### 2. Variables de entorno (Backend)

Crear `Proyecto/Backend/.env` basándose en `.env.example`:

```env
JWT_SECRET=tu_clave_secreta_jwt
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contrasena_de_aplicacion
```

### 3. Levantar la capa de datos

```bash
cd Proyecto/Data
docker compose up -d
```

### 4. Levantar los microservicios

```bash
cd Proyecto/Backend
docker compose up -d
```

### 5. Ejecutar el Frontend

```bash
cd Proyecto/Frontend
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

### 5.1 Ejecutar el Frontend(alternativa en docker)

```bash
cd Proyecto/Frontend
docker compose up -d
```

La aplicación quedará disponible en `http://localhost:3000`.

---

## Datos y persistencia

- **MongoDB**: base de datos `db-PetDate` en el contenedor `petdate-db:27017`.
- **Imágenes**: volumen compartido `petdate-uploads`. Los microservicios escriben; Nginx sirve los archivos en `/uploads/**`.
- **Backups**: el contenedor `mongo-backup` genera respaldos diarios comprimidos (`.gz`), conservando los últimos 7 días.

---

## Convenciones

- Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`.
- Los endpoints internos (`/interno/...`) son de uso exclusivo entre microservicios y no están expuestos por el gateway.
- Las respuestas de creación devuelven `HTTP 201 Created`.
- La paginación está disponible en todos los endpoints de listado.
