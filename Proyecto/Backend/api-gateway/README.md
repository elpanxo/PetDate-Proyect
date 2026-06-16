# API Gateway

Punto de entrada único de la arquitectura PetDate. Recibe todas las peticiones del cliente, valida el token JWT, inyecta headers de identidad hacia los servicios downstream y registra auditorías en MongoDB.

**Puerto**: `8080`

---

## Responsabilidades

- Enrutamiento de peticiones a cada microservicio
- Validación de tokens JWT en cada petición protegida
- Inyección de headers `X-Usuario-Id` y `X-Usuario-Rol`
- Registro de auditoría de operaciones (base de datos MongoDB)
- Control de acceso por rol para la ruta `/auditoria`

---

## Stack

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 4.0.6 |
| Spring Cloud Gateway (WebMVC) | 2025.1.1 |
| JJWT | 0.12.6 |
| MongoDB | 7.0 |
| Docker | — |

---

## Rutas configuradas

| Prefijo | Destino | Puerto |
|---|---|---|
| `/auth/**` | ms-usuarios | 8081 |
| `/auth/servicios/**` | ms-servicios | 8083 |
| `/usuarios/**` | ms-usuarios | 8081 |
| `/mascotas/**` | ms-mascotas | 8082 |
| `/servicios/**` | ms-servicios | 8083 |
| `/promociones/**` | ms-servicios | 8083 |
| `/blogs/**` | ms-servicios | 8083 |
| `/comentarios/**` | ms-comentarios | 8085 |
| `/contacto/**` | ms-comentarios | 8085 |
| `/citas/**` | ms-citas-medicas | 8084 |
| `/uploads/**` | imagen-server (Nginx) | 80 |
| `/auditoria/**` | local (solo ADMIN) | — |

---

## Endpoints de auditoría

Todos requieren rol `ADMIN`.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/auditoria` | Lista todas las auditorías (paginado) |
| GET | `/auditoria/usuario/{usuarioId}` | Auditorías de un usuario |
| GET | `/auditoria/recurso/{recurso}` | Auditorías por tipo de recurso |
| GET | `/auditoria/rango` | Auditorías por rango de fechas |

---

## Flujo de autenticación

```
Cliente → Gateway
  1. Extrae el header Authorization: Bearer <token>
  2. Valida la firma del JWT con JWT_SECRET
  3. Inyecta X-Usuario-Id y X-Usuario-Rol en la petición
  4. Registra la operación en MongoDB (auditoría)
  5. Reenvía la petición al microservicio destino
```

Las rutas públicas (`POST /auth/login`, `POST /usuarios`, `POST /auth/servicios/login`) no pasan por validación JWT.

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Clave secreta para validación de tokens |
| `SPRING_DATA_MONGODB_URI` | URI de conexión a MongoDB |

---

## Estructura del proyecto

```
api-gateway/
├── src/main/java/cl/PetDate/api_gateway/
│   ├── ApiGatewayApplication.java
│   ├── controllers/
│   │   └── AuditoriaController.java
│   ├── filters/
│   │   └── JwtAuthenticationFilter.java
│   └── configs/
│       └── GatewayConfig.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
└── pom.xml
```

---

## Ejecución con Docker

```bash
# Desde Proyecto/Backend/
docker compose up api-gateway
```

## Ejecución local

```bash
cd api-gateway
mvn spring-boot:run
```
