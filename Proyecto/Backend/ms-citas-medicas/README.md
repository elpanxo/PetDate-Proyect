# ms-citas-medicas

Microservicio de agendamiento de citas veterinarias. Permite crear y gestionar citas médicas vinculadas a usuarios y mascotas, con seguimiento de estado y eliminación en cascada desde los servicios relacionados.

**Puerto**: `8084`

---

## Responsabilidades

- CRUD de citas veterinarias
- Gestión de estados de cita (programada, completada, cancelada, etc.)
- Consulta de citas por usuario, mascota o estado
- Exposición de endpoints internos para eliminación en cascada

---

## Stack

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 4.0.6 |
| OpenFeign | — |
| MongoDB | 7.0 |
| Swagger / OpenAPI | 2.8.8 |
| Spring Actuator | — |

---

## Endpoints

### Citas médicas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/citas` | USER / ADMIN | Agenda una cita (201) |
| GET | `/citas` | ADMIN | Lista todas las citas (paginado) |
| GET | `/citas/{id}` | Dueño / ADMIN | Detalle de una cita |
| GET | `/citas/usuario/{idUsuario}` | Dueño / ADMIN | Citas de un usuario |
| GET | `/citas/mascota/{idMascota}` | Dueño / ADMIN | Citas de una mascota |
| GET | `/citas/estado/{estado}` | ADMIN | Citas por estado |
| GET | `/citas/usuario/{idUsuario}/estado/{estado}` | Dueño / ADMIN | Citas del usuario filtradas por estado |
| GET | `/citas/usuario/{idUsuario}/mascota/{idMascota}` | Dueño / ADMIN | Citas de una mascota específica del usuario |
| PUT | `/citas/{id}` | Dueño / ADMIN | Actualiza datos de la cita |
| PATCH | `/citas/{id}/estado/{estado}` | Dueño / ADMIN | Cambia solo el estado de la cita |
| DELETE | `/citas/{id}` | Dueño / ADMIN | Cancela o elimina la cita |

### Endpoints internos (solo entre microservicios)

| Método | Ruta | Descripción |
|---|---|---|
| DELETE | `/citas/interno/usuario/{idUsuario}` | Elimina todas las citas de un usuario |
| DELETE | `/citas/interno/mascota/{idMascota}` | Elimina todas las citas de una mascota |

Los endpoints `/interno/**` no están expuestos por el API Gateway.

---

## Estados de una cita

| Estado | Descripción |
|---|---|
| `PROGRAMADA` | Cita agendada, pendiente de atención |
| `COMPLETADA` | Cita realizada |
| `CANCELADA` | Cita cancelada por el usuario o servicio |
| `NO_ASISTIO` | El usuario no se presentó |

---

## Modelo principal

**CitaMedica**
```
id, usuarioId, mascotaId, servicioId,
fecha, hora, motivo, estado (EstadoEvento),
notas, fechaCreacion
```

---

## Comunicación inter-servicios (Feign)

- `UsuarioClient` → valida que el usuario existe
- `MascotaClient` → valida que la mascota existe y pertenece al usuario

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `MS_USUARIOS_URL` | URL de ms-usuarios |
| `MS_MASCOTAS_URL` | URL de ms-mascotas |
| `SPRING_DATA_MONGODB_URI` | URI de conexión a MongoDB |

---

## Estructura del proyecto

```
ms-citas-medicas/
├── src/main/java/cl/PetDate/ms_citas_medicas/
│   ├── MsCitasMedicasApplication.java
│   ├── controllers/
│   │   └── CitaMedicaController.java
│   ├── models/
│   │   ├── CitaMedica.java
│   │   └── EstadoEvento.java
│   ├── repositories/
│   ├── services/
│   │   └── CitaMedicaService.java
│   └── clients/
│       ├── UsuarioClient.java
│       └── MascotaClient.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
└── pom.xml
```

---

## Ejecución con Docker

```bash
# Desde Proyecto/Backend/
docker compose up ms-citas-medicas
```

## Ejecución local

```bash
cd ms-citas-medicas
mvn spring-boot:run
```

Swagger UI disponible en: `http://localhost:8084/swagger-ui.html`
