# ms-mascotas

Microservicio de gestión de mascotas. Permite crear, consultar, actualizar y eliminar las mascotas de cada usuario, incluyendo la carga de imágenes. Implementa eliminación en cascada hacia las citas médicas al borrar una mascota.

**Puerto**: `8082`

---

## Responsabilidades

- CRUD completo de mascotas
- Carga y gestión de imágenes de mascotas (hasta 10 MB)
- Asociación de mascotas a usuarios
- Eliminación en cascada: al borrar una mascota se eliminan sus citas médicas
- Expone endpoints internos para que otros servicios consulten datos sin pasar por el gateway

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

### Mascotas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/mascotas` | USER / ADMIN | Registra una nueva mascota (201) |
| GET | `/mascotas` | ADMIN | Lista todas las mascotas (paginado, orden por nombre) |
| GET | `/mascotas/{id}` | Dueño / ADMIN | Obtiene detalle de una mascota |
| GET | `/mascotas/usuario/{usuarioId}` | Dueño / ADMIN | Lista mascotas de un usuario |
| PUT | `/mascotas/{id}` | Dueño / ADMIN | Actualiza datos de la mascota |
| DELETE | `/mascotas/{id}` | Dueño / ADMIN | Elimina mascota (cascada a citas) |
| POST | `/mascotas/{id}/imagen` | Dueño / ADMIN | Sube imagen de la mascota |

### Endpoints internos (solo entre microservicios)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/mascotas/interno/{id}` | Obtiene mascota por ID |
| DELETE | `/mascotas/interno/usuario/{usuarioId}` | Elimina todas las mascotas de un usuario |

Los endpoints `/interno/**` no están expuestos por el API Gateway.

---

## Modelo principal

**Mascota**
```
id, nombre, especie, raza, edad, peso,
usuarioId, imagen, fechaRegistro
```

---

## Comunicación inter-servicios (Feign)

Al eliminar una mascota (`DELETE /mascotas/{id}`), el servicio invoca:
- `CitaMedicaClient` → elimina todas las citas de esa mascota

El cliente `UsuarioClient` se usa para validar que el usuario dueño existe.

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `MS_USUARIOS_URL` | URL de ms-usuarios |
| `MS_CITAS_MEDICAS_URL` | URL de ms-citas-medicas |
| `SPRING_DATA_MONGODB_URI` | URI de conexión a MongoDB |
| `SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE` | Tamaño máximo por archivo (10MB) |

---

## Estructura del proyecto

```
ms-mascotas/
├── src/main/java/cl/PetDate/ms_mascotas/
│   ├── MsMascotasApplication.java
│   ├── controllers/
│   │   └── MascotaController.java
│   ├── models/
│   │   └── Mascota.java
│   ├── repositories/
│   ├── services/
│   │   └── MascotaService.java
│   └── clients/
│       ├── UsuarioClient.java
│       └── CitaMedicaClient.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
└── pom.xml
```

---

## Ejecución con Docker

```bash
# Desde Proyecto/Backend/
docker compose up ms-mascotas
```

## Ejecución local

```bash
cd ms-mascotas
mvn spring-boot:run
```

Swagger UI disponible en: `http://localhost:8082/swagger-ui.html`
