# ms-usuarios

Microservicio de gestión de usuarios. Administra el registro, autenticación, perfiles y la recuperación de contraseña. Genera los tokens JWT que el resto del sistema consume.

**Puerto**: `8081`

---

## Responsabilidades

- Registro e inicio de sesión de usuarios
- Generación y validación de tokens JWT
- CRUD de perfiles de usuario
- Carga de foto de perfil
- Recuperación de contraseña por correo (código de 6 dígitos)
- Eliminación en cascada: al borrar un usuario se eliminan sus mascotas, citas y comentarios

---

## Stack

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 4.0.5 |
| Spring Security | — |
| JJWT | 0.12.6 |
| Spring Mail (Gmail SMTP) | — |
| OpenFeign | — |
| MongoDB | 7.0 |
| Swagger / OpenAPI | 2.8.8 |
| Spring Actuator | — |

---

## Endpoints

### Autenticación (públicos)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Inicio de sesión; devuelve JWT |
| POST | `/auth/forgot-password` | Solicita código de recuperación por correo |
| POST | `/auth/reset-password` | Restablece contraseña con el código |

### Usuarios

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/usuarios` | Público | Registro de nuevo usuario |
| GET | `/usuarios` | ADMIN | Lista todos los usuarios (paginado) |
| GET | `/usuarios/{id}` | Dueño / ADMIN | Obtiene perfil de usuario |
| GET | `/usuarios/correo/{correo}` | Interno | Busca usuario por correo |
| PUT | `/usuarios/{id}` | Dueño / ADMIN | Actualiza perfil |
| DELETE | `/usuarios/{id}` | Dueño / ADMIN | Elimina usuario (cascada) |
| POST | `/usuarios/{id}/imagen` | Dueño / ADMIN | Sube foto de perfil |

---

## Modelos principales

**Usuario**
```
id, nombre, apellido, correo, contrasena (hash),
telefono, rol (ADMIN | USER), imagen, fechaCreacion
```

**Rol**
```
ADMIN — acceso total
USER  — acceso solo a sus propios recursos
```

**PasswordResetToken**
```
id, usuarioId, codigo (6 dígitos), expiracion, usado
```

---

## Flujo de recuperación de contraseña

```
1. POST /auth/forgot-password  →  genera código y lo envía por Gmail
2. Usuario recibe el correo con el código de 6 dígitos
3. POST /auth/reset-password   →  valida código y actualiza contraseña
```

El código es de un solo uso y expira automáticamente.

---

## Comunicación inter-servicios (Feign)

Al eliminar un usuario (`DELETE /usuarios/{id}`), el servicio invoca:
- `MascotaClient` → elimina las mascotas del usuario
- `CitaMedicaClient` → elimina las citas del usuario
- `ComentarioClient` → elimina los comentarios del usuario

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Clave de firma del token JWT |
| `MAIL_USERNAME` | Correo Gmail para envíos |
| `MAIL_PASSWORD` | Contraseña de aplicación Gmail |
| `MS_MASCOTAS_URL` | URL de ms-mascotas |
| `MS_CITAS_MEDICAS_URL` | URL de ms-citas-medicas |
| `MS_COMENTARIOS_URL` | URL de ms-comentarios |
| `SPRING_DATA_MONGODB_URI` | URI de conexión a MongoDB |

---

## Estructura del proyecto

```
ms-usuarios/
├── src/main/java/cl/PetDate/ms_usuarios/
│   ├── MsUsuariosApplication.java
│   ├── controllers/
│   │   ├── AuthController.java
│   │   └── UsuarioController.java
│   ├── models/
│   │   ├── Usuario.java
│   │   ├── Rol.java
│   │   └── PasswordResetToken.java
│   ├── repositories/
│   ├── services/
│   │   ├── UsuarioService.java
│   │   └── PasswordResetService.java
│   ├── security/
│   │   └── JwtService.java
│   ├── filters/
│   │   └── JwtClaimsFilter.java
│   └── clients/
│       ├── MascotaClient.java
│       ├── CitaMedicaClient.java
│       └── ComentarioClient.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
└── pom.xml
```

---

## Ejecución con Docker

```bash
# Desde Proyecto/Backend/
docker compose up ms-usuarios
```

## Ejecución local

```bash
cd ms-usuarios
mvn spring-boot:run
```

Swagger UI disponible en: `http://localhost:8081/swagger-ui.html`
