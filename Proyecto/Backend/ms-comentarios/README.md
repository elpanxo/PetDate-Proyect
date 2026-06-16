# ms-comentarios

Microservicio de comentarios y contacto. Gestiona las reseñas de servicios veterinarios, comentarios en blogs y el formulario de contacto, que envía correos automáticos a la dirección de la empresa.

**Puerto**: `8085`

---

## Responsabilidades

- CRUD de reseñas sobre servicios veterinarios
- CRUD de comentarios en publicaciones de blog
- Procesamiento del formulario de contacto (envío de correo a `petdate8@gmail.com`)
- Sin dependencias de Feign hacia otros microservicios (servicio autónomo)

---

## Stack

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 4.0.6 |
| Spring Mail (Gmail SMTP) | — |
| MongoDB | 7.0 |
| Swagger / OpenAPI | 2.8.8 |
| Spring Actuator | — |

---

## Endpoints

### Comentarios de servicios

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/comentarios/servicios` | USER / ADMIN | Agrega reseña a un servicio (201) |
| GET | `/comentarios/servicios/{servicioId}` | Público | Lista reseñas de un servicio |
| PUT | `/comentarios/servicios/{id}` | Autor / ADMIN | Actualiza propia reseña |
| DELETE | `/comentarios/servicios/{id}` | Autor / ADMIN | Elimina propia reseña |

### Comentarios de blogs

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/comentarios/blogs` | USER / ADMIN | Agrega comentario a un blog (201) |
| GET | `/comentarios/blogs/{blogId}` | Público | Lista comentarios de un blog |
| PUT | `/comentarios/blogs/{id}` | Autor / ADMIN | Actualiza propio comentario |
| DELETE | `/comentarios/blogs/{id}` | Autor / ADMIN | Elimina propio comentario |

### Contacto

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/contacto` | Público | Envía formulario de contacto |

El formulario de contacto envía un correo automático a `petdate8@gmail.com` con los datos del mensaje.

**Body requerido para `/contacto`:**
```json
{
  "nombre": "string",
  "correo": "string",
  "asunto": "string",
  "mensaje": "string"
}
```

---

## Modelos principales

**ComentarioServicio**
```
id, servicioId, usuarioId, calificacion (1-5),
contenido, fechaCreacion
```

**ComentarioBlog**
```
id, blogId, usuarioId, contenido, fechaCreacion
```

**Contacto**
```
id, nombre, correo, asunto, mensaje, fechaEnvio
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `MAIL_USERNAME` | Correo Gmail para envíos |
| `MAIL_PASSWORD` | Contraseña de aplicación Gmail |
| `SPRING_DATA_MONGODB_URI` | URI de conexión a MongoDB |

---

## Estructura del proyecto

```
ms-comentarios/
├── src/main/java/cl/PetDate/ms_comentarios/
│   ├── MsComentariosApplication.java
│   ├── controllers/
│   │   ├── ComentarioServicioController.java
│   │   ├── ComentarioBlogController.java
│   │   └── ContactoController.java
│   ├── models/
│   │   ├── ComentarioServicio.java
│   │   ├── ComentarioBlog.java
│   │   └── Contacto.java
│   ├── repositories/
│   └── services/
│       ├── ComentarioServicioService.java
│       ├── ComentarioBlogService.java
│       └── ContactoService.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
└── pom.xml
```

---

## Ejecución con Docker

```bash
# Desde Proyecto/Backend/
docker compose up ms-comentarios
```

## Ejecución local

```bash
cd ms-comentarios
mvn spring-boot:run
```

Swagger UI disponible en: `http://localhost:8085/swagger-ui.html`
