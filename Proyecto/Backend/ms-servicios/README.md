# ms-servicios

Microservicio de gestión de empresas y contenido. Administra el registro de servicios veterinarios (veterinarias, urgencias, tiendas), promociones y publicaciones de blog. Incluye su propio flujo de autenticación para cuentas de tipo empresa.

**Puerto**: `8083`

---

## Responsabilidades

- CRUD de servicios/empresas veterinarias
- CRUD de promociones asociadas a servicios
- CRUD de blogs y publicaciones
- Autenticación independiente para cuentas de empresa (rol `SERVICIO`)
- Carga de imágenes por servicio
- Filtrado de servicios por tipo y por comuna
- Notificaciones por correo (Spring Mail)

---

## Stack

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 4.0.6 |
| Spring Security + JWT | — |
| Spring Mail (Gmail SMTP) | — |
| OpenFeign | — |
| MongoDB | 7.0 |
| Swagger / OpenAPI | 2.8.8 |
| Spring Actuator | — |

---

## Endpoints

### Autenticación de empresas (públicos)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/servicios/login` | Login de empresa; devuelve JWT |
| POST | `/auth/servicios/forgot-password` | Solicita código de recuperación |
| POST | `/auth/servicios/reset-password` | Restablece contraseña con código |

### Servicios / Empresas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/servicios` | SERVICIO / ADMIN | Registra nuevo servicio (201) |
| GET | `/servicios` | Público | Lista todos los servicios (paginado) |
| GET | `/servicios/{id}` | Público | Detalle de un servicio |
| GET | `/servicios/tipo/{tipoServicio}` | Público | Filtra por tipo de servicio |
| GET | `/servicios/comuna/{comuna}` | Público | Filtra por ubicación/comuna |
| PUT | `/servicios/{id}` | Dueño / ADMIN | Actualiza datos del servicio |
| DELETE | `/servicios/{id}` | Dueño / ADMIN | Elimina el servicio |
| POST | `/servicios/{id}/imagen` | Dueño / ADMIN | Sube imagen del servicio |

### Promociones

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/promociones` | SERVICIO / ADMIN | Crea promoción (201) |
| GET | `/promociones` | Público | Lista promociones (paginado) |
| GET | `/promociones/{id}` | Público | Detalle de una promoción |
| PUT | `/promociones/{id}` | Dueño / ADMIN | Actualiza promoción |
| DELETE | `/promociones/{id}` | Dueño / ADMIN | Elimina promoción |

### Blogs

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/blogs` | SERVICIO / ADMIN | Crea publicación (201) |
| GET | `/blogs` | Público | Lista publicaciones (paginado) |
| GET | `/blogs/{id}` | Público | Detalle de una publicación |
| PUT | `/blogs/{id}` | Dueño / ADMIN | Actualiza publicación |
| DELETE | `/blogs/{id}` | Dueño / ADMIN | Elimina publicación |

---

## Modelos principales

**Servicio**
```
id, nombre, tipoServicio, descripcion, direccion, comuna,
telefono, correo, contrasena (hash), imagen, fechaCreacion
```

**Promocion**
```
id, servicioId, titulo, descripcion, descuento,
fechaInicio, fechaFin, imagen
```

**Blog**
```
id, servicioId, titulo, contenido, imagen, fechaPublicacion
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Clave de firma del token JWT |
| `MAIL_USERNAME` | Correo Gmail para envíos |
| `MAIL_PASSWORD` | Contraseña de aplicación Gmail |
| `SPRING_DATA_MONGODB_URI` | URI de conexión a MongoDB |

---

## Estructura del proyecto

```
ms-servicios/
├── src/main/java/cl/PetDate/ms_servicios/
│   ├── MsServiciosApplication.java
│   ├── controllers/
│   │   ├── AuthController.java
│   │   ├── ServicioController.java
│   │   ├── PromocionController.java
│   │   └── BlogController.java
│   ├── models/
│   │   ├── Servicio.java
│   │   ├── Promocion.java
│   │   └── Blog.java
│   ├── repositories/
│   ├── services/
│   │   ├── ServicioService.java
│   │   ├── PromocionService.java
│   │   └── BlogService.java
│   └── security/
│       └── JwtService.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
└── pom.xml
```

---

## Ejecución con Docker

```bash
# Desde Proyecto/Backend/
docker compose up ms-servicios
```

## Ejecución local

```bash
cd ms-servicios
mvn spring-boot:run
```

Swagger UI disponible en: `http://localhost:8083/swagger-ui.html`
