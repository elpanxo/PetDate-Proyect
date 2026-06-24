# PetDate — Plataforma Integral de Cuidado de Mascotas

PetDate es una plataforma web orientada a centralizar información relacionada con el cuidado de mascotas. El sistema permite registrar usuarios, administrar mascotas, consultar servicios, gestionar publicaciones, promociones, comentarios y tener una agenda de eventos veterinarios asociados a las mascotas.

El proyecto fue desarrollado para la asignatura **Taller Aplicado de Programación (TPY1101)**, bajo una arquitectura cliente-servidor con frontend en React, backend en Spring Boot, base de datos MongoDB y despliegue mediante Docker.

## Tabla de contenidos
1. [Integrantes](#integrantes)
2. [Descripción general](#descripción-general)
3. [Problemática](#problemática)
4. [Objetivos](#objetivos)
5. [Alcance del sistema](#alcance-del-sistema)
6. [Funcionalidades principales](#funcionalidades-principales)
7. [Actores del sistema](#actores-del-sistema)
8. [Arquitectura general](#arquitectura-general)
9. [Tecnologías utilizadas](#tecnologías-utilizadas)
10. [Estructura del proyecto](#estructura-del-proyecto)
11. [Requisitos previos](#requisitos-previos)
12. [Variables de entorno](#variables-de-entorno)
13. [Instalación y ejecución con Docker](#instalación-y-ejecución-con-docker)
14. [Ejecución en modo desarrollo](#ejecución-en-modo-desarrollo)
15. [Rutas principales del frontend](#rutas-principales-del-frontend)
16. [Microservicios y endpoints principales](#microservicios-y-endpoints-principales)
17. [Base de datos, archivos e imágenes](#base-de-datos-archivos-e-imágenes)
18. [Seguridad](#seguridad)
19. [Pruebas funcionales](#pruebas-funcionales)
20. [Control de versiones](#control-de-versiones)
21. [Problemas frecuentes](#problemas-frecuentes) 

## Integrantes

- Camila González
- Francisco Agüero
- Eliecer Salgado

Asignatura: **Taller Aplicado de Programación**  
Proyecto: **PetDate — Plataforma Integral de Cuidado de Mascotas**

## Descripción general

PetDate busca entregar una solución digital para dueños de mascotas y empresas relacionadas con servicios veterinarios o de cuidado animal. La aplicación permite centralizar información relevante, reducir la dispersión de datos y mejorar el acceso a servicios desde una plataforma web.

La solución considera distintos perfiles de usuario:

- Dueños de mascotas.
- Empresas o proveedores de servicios.
- Administrador del sistema.

El sistema está dividido en frontend, API Gateway, microservicios backend, base de datos MongoDB y un servidor de imágenes basado en Nginx.

## Problemática

Los dueños de mascotas suelen gestionar información médica, recordatorios, datos de cuidado y búsqueda de servicios de forma separada. Esta dispersión genera desorganización, pérdida de antecedentes importantes y dificultad para tomar decisiones informadas sobre el bienestar de la mascota.

PetDate aborda esta problemática mediante una plataforma web centralizada que permite registrar información, consultar servicios y mantener datos relevantes en un solo entorno.

## Objetivos

### Objetivo general

Crear una plataforma digital que centralice información sobre el cuidado de mascotas, mejorando el acceso a datos relevantes para los dueños y facilitando la interacción con servicios asociados al cuidado animal.

### Objetivos específicos

- Implementar un módulo de registro e inicio de sesión para usuarios dueños de mascota, empresas prestadoras de servicios y administrador del sistema.
- Permitir la gestión de mascotas asociadas a usuarios registrados, considerando registro, visualización, edición y eliminación de información.
- Gestionar eventos o citas médicas vinculadas a mascotas, permitiendo registrar y visualizar información relevante desde la plataforma.
- Permitir a las empresas registrar y visualizar información relacionada con servicios, publicaciones, blogs y promociones dentro de la plataforma.
- Habilitar la interacción de usuarios mediante comentarios o reseñas asociados a servicios o publicaciones disponibles en PetDate.
- Incorporar un panel administrativo que permita supervisar la información registrada en el sistema, incluyendo usuarios, mascotas, citas, servicios, blogs, comentarios y auditoría.
- Integrar frontend, backend y base de datos mediante una arquitectura modular, permitiendo que las acciones realizadas desde la interfaz web sean procesadas y almacenadas correctamente.

## Alcance del sistema

El sistema contempla una plataforma web que permite:

- Registro de dueños de mascota.
- Registro de empresas o servicios.
- Inicio de sesión para usuarios, empresas y administrador.
- Gestión de mascotas por usuario.
- Gestión de eventos asociados a mascotas.
- Visualización de servicios disponibles.
- Gestión de perfil de empresa.
- Publicación de promociones.
- Publicación y visualización de blogs.
- Registro y visualización de comentarios o reseñas.
- Formulario de contacto.
- Panel administrativo.
- Auditoría de operaciones desde el API Gateway.
- Carga de imágenes para usuarios, mascotas, servicios y blogs.

### Mejoras futuras

- Aplicación móvil nativa.
- Sistema avanzado de notificaciones push.
- Agenda veterinaria con disponibilidad en tiempo real por profesional.
- Chat interno entre usuario y empresa.

## Funcionalidades principales

### Usuario dueño de mascota

- Registro de cuenta personal.
- Inicio de sesión con correo y contraseña.
- Recuperación de contraseña mediante correo.
- Visualización y edición de perfil.
- Registro de mascotas.
- Edición y eliminación de mascotas.
- Carga de imagen de mascota.
- Visualización de detalle de mascota.
- Registro y gestión de eventos veterinarios.
- Consulta de servicios disponibles.
- Consulta de blogs.
- Registro de comentarios o calificaciones.

### Empresa o proveedor de servicio

- Registro de empresa o servicio.
- Inicio de sesión de empresa.
- Recuperación de contraseña.
- Gestión de perfil de empresa.
- Carga de imagen del servicio.
- Publicación de promociones.
- Gestión de publicaciones de blog.
- Visualización de información asociada a la empresa.

### Administrador

- Inicio de sesión administrativo.
- Dashboard administrativo.
- Gestión de usuarios.
- Gestión de mascotas.
- Gestión de citas.
- Gestión de comentarios.
- Gestión de blogs.
- Gestión de servicios.
- Revisión de registros de auditoría.

### Funcionalidades públicas

- Página de inicio.
- Página Nosotros.
- Página Contacto.
- Política de privacidad.
- Listado de servicios.
- Detalle de servicios.
- Listado de blogs.
- Detalle de blogs.

## Actores del sistema

| Actor | Descripción |
|---|---|
| Usuario dueño de mascota | Persona que registra mascotas, consulta servicios y gestiona citas o eventos. |
| Empresa / servicio | Proveedor que registra su empresa, publica promociones y contenido. |
| Administrador | Usuario con permisos para revisar y administrar información general del sistema. |
| Visitante | Usuario no autenticado que puede navegar por contenido público. |


## Arquitectura general

PetDate utiliza una arquitectura web modular basada en microservicios.

```text
Usuario / Navegador
        ↓
Frontend React + Vite
        ↓
API Gateway Spring Boot :8080
        ↓
 ┌─────────────────────────────────────────────┐
 │ Microservicios backend                      │
 │                                             │
 │ ms-usuarios        :8081                    │
 │ ms-mascotas        :8082                    │
 │ ms-servicios       :8083                    │
 │ ms-citas-medicas   :8084                    │
 │ ms-comentarios     :8085                    │
 └─────────────────────────────────────────────┘
        ↓
MongoDB :27017
        ↓
Servidor de imágenes Nginx
```

### Componentes principales

| Componente | Descripción |
|---|---|
| Frontend | Aplicación React encargada de la interfaz de usuario. |
| API Gateway | Punto de entrada único para el backend. Valida JWT, enruta peticiones y registra auditoría. |
| ms-usuarios | Gestiona usuarios, login, recuperación de contraseña y perfil. |
| ms-mascotas | Gestiona mascotas e imágenes asociadas. |
| ms-servicios | Gestiona empresas, servicios, promociones y blogs. |
| ms-citas-medicas | Gestiona citas y eventos médicos. |
| ms-comentarios | Gestiona comentarios, reseñas y formulario de contacto. |
| MongoDB | Base de datos principal. |
| imagen-server | Servidor Nginx para exponer archivos e imágenes cargadas. |
| mongo-backup | Servicio de respaldo periódico de la base de datos. |


## Tecnologías utilizadas

### Frontend

| Tecnología | Uso |
|---|---|
| React | Construcción de interfaz web mediante componentes. |
| Vite | Entorno de desarrollo y empaquetado del frontend. |
| React Router DOM | Gestión de rutas del frontend. |
| CSS puro por componente | Estilos visuales y estructura responsive de la interfaz. |
| Lucide React | Íconos utilizados en componentes visuales. |
| Nginx | Servidor web para despliegue del build de producción. |

> Nota: el archivo `package.json` puede contener dependencias heredadas como Bootstrap o React Bootstrap. La documentación funcional del proyecto considera que la interfaz final se trabaja con CSS propio por componente.

### Backend

| Tecnología | Uso |
|---|---|
| Java 17 | Lenguaje principal del backend. |
| Spring Boot | Desarrollo de microservicios. |
| Spring Security | Seguridad y control de acceso. |
| JWT / JJWT | Autenticación basada en tokens. |
| Spring Cloud Gateway | Enrutamiento mediante API Gateway. |
| OpenFeign | Comunicación entre microservicios. |
| Spring Mail | Envío de correos para recuperación de contraseña y contacto. |
| Swagger / OpenAPI | Documentación y prueba de endpoints. |
| MongoDB | Persistencia de datos. |
| Docker | Contenerización del sistema. |
| Docker Compose | Orquestación local de servicios. |

### Base de datos e infraestructura

| Tecnología | Uso |
|---|---|
| MongoDB 7.0 | Base de datos no relacional. |
| Nginx | Servidor de imágenes y servidor del frontend. |
| Docker Volumes | Persistencia de base de datos e imágenes. |
| Mongo Backup | Respaldos automáticos con `mongodump`. |


## Estructura del proyecto

```text
Proyecto/
├── Backend/
│   ├── api-gateway/
│   ├── ms-usuarios/
│   ├── ms-mascotas/
│   ├── ms-servicios/
│   ├── ms-citas-medicas/
│   ├── ms-comentarios/
│   ├── docker-compose.yml
│   └── .env
│
├── Data/
│   ├── docker-compose.yml
│   ├── init.js
│   ├── backups/
│   ├── image-server/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── .env
│
└── Frontend/
    ├── src/
    │   ├── api/
    │   │   └── petdate-api.js
    │   ├── assets/
    │   ├── components/
    │   │   ├── admin/
    │   │   ├── blogs/
    │   │   ├── comentarios/
    │   │   ├── contacto/
    │   │   ├── footer/
    │   │   ├── home/
    │   │   ├── login/
    │   │   ├── miEmpresa/
    │   │   ├── misMascotas/
    │   │   ├── navbar/
    │   │   ├── nosotros/
    │   │   ├── politicaPrivacidad/
    │   │   ├── servicios/
    │   │   └── session/
    │   ├── App.jsx
    │   └── main.jsx
    ├── Dockerfile
    ├── docker-compose.yml
    ├── nginx.conf
    ├── package.json
    └── vite.config.js
```

## Requisitos previos

Para ejecutar el proyecto se requiere:

- Docker Desktop instalado y en ejecución.
- Docker Compose habilitado.
- Node.js 20 o superior, solo si se ejecuta el frontend en modo desarrollo.
- Java 17, solo si se ejecutan microservicios fuera de Docker.
- Maven, solo si se ejecutan microservicios fuera de Docker.
- Navegador web moderno.

## Variables de entorno

El proyecto utiliza archivos `.env` separados para `Data/` y `Backend/`.

### Data/.env

```env
MONGO_USER=usuario_mongo
MONGO_PASSWORD=password_mongo
MONGO_DATABASE=petdate
```

### Backend/.env

```env
JWT_SECRET=clave_secreta_jwt
MONGO_USER=usuario_mongo
MONGO_PASSWORD=password_mongo
MONGO_DATABASE=petdate
MAIL_USERNAME=correo@gmail.com
MAIL_PASSWORD=password_de_aplicacion
ADMIN_EMAIL=admin@petdate.cl
ADMIN_PASSWORD=password_admin
```

### Recomendaciones de seguridad

- No subir archivos `.env` con credenciales reales al repositorio.
- Crear un archivo `.env.example` para documentar las variables necesarias.
- Generar claves seguras para `JWT_SECRET`.
- Utilizar contraseñas de aplicación para Gmail si se habilitan correos.
- Mantener fuera del repositorio archivos de respaldo con datos sensibles.

## Instalación y ejecución con Docker

El levantamiento recomendado se realiza en tres pasos: base de datos, backend y frontend.

### 1. Levantar base de datos, red, volumen de imágenes y servidor de imágenes

```bash
cd Proyecto/Data
docker compose up -d --build
```

Este comando crea o utiliza:

- Red Docker: `petdate-network`
- Volumen de MongoDB: `petdate-data`
- Volumen compartido de imágenes: `petdate-uploads`
- Contenedor MongoDB: `db-PetDate`
- Contenedor de imágenes: `petdate-imagen-server`
- Contenedor de respaldos: `petdate-backup`

### 2. Levantar backend completo

```bash
cd ../Backend
docker compose up -d --build
```

Servicios levantados:

| Servicio | Contenedor | Puerto interno | Puerto expuesto |
|---|---|---:|---:|
| API Gateway | `petdate-api-gateway` | 8080 | 8080 |
| Usuarios | `petdate-ms-usuarios` | 8081 | No expuesto |
| Mascotas | `petdate-ms-mascotas` | 8082 | No expuesto |
| Servicios | `petdate-ms-servicios` | 8083 | No expuesto |
| Citas médicas | `petdate-ms-citas-medicas` | 8084 | No expuesto |
| Comentarios | `petdate-ms-comentarios` | 8085 | No expuesto |

El frontend consume el backend mediante:

```text
http://localhost:8080
```

### 3. Levantar frontend en Docker

```bash
cd ../Frontend
docker compose up -d --build
```

La aplicación queda disponible en:

```text
http://localhost:3000
```

### Ver contenedores activos

```bash
docker ps
```

### Ver logs

```bash
docker logs petdate-api-gateway
```

```bash
docker logs petdate-ms-usuarios
```

```bash
docker logs db-PetDate
```

### Detener el sistema

Desde cada carpeta donde se ejecutó Docker Compose:

```bash
docker compose down
```

Para eliminar volúmenes de datos se debe usar con precaución:

```bash
docker compose down -v
```

---

## Ejecución en modo desarrollo

### Frontend

```bash
cd Proyecto/Frontend
npm install
npm run dev
```

URL por defecto:

```text
http://localhost:5173
```

Comandos disponibles:

```bash
npm run dev       # Ejecuta frontend en modo desarrollo
npm run build     # Genera build de producción
npm run preview   # Previsualiza build de producción
npm run lint      # Ejecuta ESLint
```

### Backend local

Cada microservicio puede levantarse con Maven si la base de datos ya está disponible.

Ejemplo:

```bash
cd Proyecto/Backend/ms-usuarios
./mvnw spring-boot:run
```

En Windows:

```bash
mvnw.cmd spring-boot:run
```

Orden recomendado en local:

1. MongoDB.
2. ms-usuarios.
3. ms-mascotas.
4. ms-servicios.
5. ms-citas-medicas.
6. ms-comentarios.
7. api-gateway.
8. frontend.

Para uso normal del proyecto se recomienda Docker Compose, ya que configura red, variables y dependencias entre servicios.

---

## Rutas principales del frontend

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio. |
| `/login` | Inicio de sesión de usuario dueño de mascota. |
| `/register` | Registro de usuario. |
| `/login-empresa` | Inicio de sesión de empresa. |
| `/recuperar-contrasena` | Recuperación de contraseña de usuario. |
| `/recuperar-contrasena-empresa` | Recuperación de contraseña de empresa. |
| `/nosotros` | Información institucional. |
| `/contacto` | Formulario de contacto. |
| `/blogs` | Listado de blogs. |
| `/blogs/:id` | Detalle de blog. |
| `/servicios` | Listado de servicios. |
| `/servicios/:id` | Detalle de servicio. |
| `/mis-mascotas` | Gestión de mascotas del usuario autenticado. |
| `/mis-mascotas/:id` | Detalle y edición de mascota. |
| `/mi-empresa` | Panel de empresa autenticada. |
| `/politica-privacidad` | Política de privacidad. |
| `/admin/login` | Login administrativo. |
| `/admin` | Dashboard administrativo. |
| `/admin/usuarios` | Administración de usuarios. |
| `/admin/mascotas` | Administración de mascotas. |
| `/admin/citas` | Administración de citas. |
| `/admin/comentarios` | Administración de comentarios. |
| `/admin/blogs` | Administración de blogs. |
| `/admin/servicios` | Administración de servicios. |
| `/admin/logs` | Auditoría del sistema. |

---

## Microservicios y endpoints principales

Todas las rutas públicas y protegidas se consumen mediante el API Gateway:

```text
http://localhost:8080
```

### API Gateway

Responsabilidades:

- Punto único de entrada al backend.
- Validación de JWT.
- Propagación de identidad mediante headers internos.
- Registro de auditoría.
- Enrutamiento hacia microservicios.

| Prefijo | Servicio destino |
|---|---|
| `/auth/**` | ms-usuarios |
| `/auth/servicios/**` | ms-servicios |
| `/usuarios/**` | ms-usuarios |
| `/mascotas/**` | ms-mascotas |
| `/servicios/**` | ms-servicios |
| `/promociones/**` | ms-servicios |
| `/blogs/**` | ms-servicios |
| `/comentarios/**` | ms-comentarios |
| `/contacto/**` | ms-comentarios |
| `/citas/**` | ms-citas-medicas |
| `/auditoria/**` | api-gateway |

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Login de usuario. |
| POST | `/auth/admin/login` | Login de administrador. |
| POST | `/auth/forgot-password` | Solicitud de recuperación de contraseña usuario. |
| POST | `/auth/reset-password` | Restablecimiento de contraseña usuario. |
| POST | `/auth/servicios/login` | Login de empresa. |
| POST | `/auth/servicios/forgot-password` | Solicitud de recuperación de contraseña empresa. |
| POST | `/auth/servicios/reset-password` | Restablecimiento de contraseña empresa. |

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/usuarios` | Crear usuario. |
| GET | `/usuarios` | Listar usuarios. |
| GET | `/usuarios/{id}` | Buscar usuario por ID. |
| GET | `/usuarios/correo/{correo}` | Buscar usuario por correo. |
| PUT | `/usuarios/{id}` | Actualizar usuario. |
| DELETE | `/usuarios/{id}` | Eliminar usuario. |
| POST | `/usuarios/{id}/imagen` | Subir imagen de perfil. |

### Mascotas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/mascotas` | Crear mascota. |
| GET | `/mascotas` | Listar mascotas. |
| GET | `/mascotas/{id}` | Buscar mascota por ID. |
| GET | `/mascotas/usuario/{usuarioId}` | Listar mascotas por usuario. |
| PUT | `/mascotas/{id}` | Actualizar mascota. |
| DELETE | `/mascotas/{id}` | Eliminar mascota. |
| POST | `/mascotas/{id}/imagen` | Subir imagen de mascota. |

### Citas médicas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/citas` | Crear cita o evento médico. |
| GET | `/citas` | Listar citas. |
| GET | `/citas/{id}` | Buscar cita por ID. |
| GET | `/citas/usuario/{idUsuario}` | Listar citas por usuario. |
| GET | `/citas/mascota/{idMascota}` | Listar citas por mascota. |
| GET | `/citas/estado/{estado}` | Listar citas por estado. |
| GET | `/citas/usuario/{idUsuario}/estado/{estado}` | Listar citas de usuario por estado. |
| GET | `/citas/usuario/{idUsuario}/mascota/{idMascota}` | Listar citas de mascota perteneciente a usuario. |
| PUT | `/citas/{id}` | Actualizar cita. |
| PATCH | `/citas/{id}/estado/{estado}` | Cambiar estado de cita. |
| DELETE | `/citas/{id}` | Eliminar cita. |

Estados utilizados en frontend:

```text
PENDIENTE
COMPLETADO
VENCIDO
```

### Servicios / empresas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/servicios` | Registrar empresa o servicio. |
| GET | `/servicios` | Listar servicios. |
| GET | `/servicios/{id}` | Buscar servicio por ID. |
| GET | `/servicios/tipo/{tipoServicio}` | Filtrar servicios por tipo. |
| GET | `/servicios/comuna/{comuna}` | Filtrar servicios por comuna. |
| PUT | `/servicios/{id}` | Actualizar servicio. |
| DELETE | `/servicios/{id}` | Eliminar servicio. |
| POST | `/servicios/{id}/imagen` | Subir imagen de servicio. |

### Promociones

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/promociones` | Crear promoción. |
| GET | `/promociones` | Listar promociones. |
| GET | `/promociones/{id}` | Buscar promoción por ID. |
| GET | `/promociones/servicio/{idServicio}` | Listar promociones por servicio. |
| PUT | `/promociones/{id}` | Actualizar promoción. |
| DELETE | `/promociones/{id}` | Eliminar promoción. |

### Blogs

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/blogs` | Crear blog. |
| GET | `/blogs` | Listar blogs. |
| GET | `/blogs/{id}` | Buscar blog por ID. |
| GET | `/blogs/servicio/{idServicio}` | Listar blogs por servicio. |
| PUT | `/blogs/{id}` | Actualizar blog. |
| DELETE | `/blogs/{id}` | Eliminar blog. |
| POST | `/blogs/{id}/imagen` | Subir imagen de blog. |

### Comentarios

#### Comentarios de blog

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/comentarios/blog` | Crear comentario en blog. |
| GET | `/comentarios/blog` | Listar comentarios de blog. |
| GET | `/comentarios/blog/{id}` | Buscar comentario de blog por ID. |
| GET | `/comentarios/blog/blog/{idBlog}` | Listar comentarios por blog. |
| GET | `/comentarios/blog/usuario/{idUsuario}` | Listar comentarios de blog por usuario. |
| PUT | `/comentarios/blog/{id}` | Actualizar comentario de blog. |
| DELETE | `/comentarios/blog/{id}` | Eliminar comentario de blog. |

#### Comentarios de servicio

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/comentarios/servicio` | Crear comentario o reseña sobre servicio. |
| GET | `/comentarios/servicio` | Listar comentarios de servicio. |
| GET | `/comentarios/servicio/{id}` | Buscar comentario de servicio por ID. |
| GET | `/comentarios/servicio/servicio/{idServicio}` | Listar comentarios por servicio. |
| GET | `/comentarios/servicio/usuario/{idUsuario}` | Listar comentarios de servicio por usuario. |
| PUT | `/comentarios/servicio/{id}` | Actualizar comentario de servicio. |
| DELETE | `/comentarios/servicio/{id}` | Eliminar comentario de servicio. |

### Contacto

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/contacto` | Enviar mensaje desde formulario de contacto. |

Body esperado:

```json
{
  "nombre": "Nombre Apellido",
  "correo": "correo@ejemplo.cl",
  "mensaje": "Mensaje de contacto"
}
```

### Auditoría

Endpoints reservados para administrador.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/auditoria` | Listar auditoría. |
| GET | `/auditoria/usuario/{usuarioId}` | Filtrar auditoría por usuario. |
| GET | `/auditoria/recurso/{recurso}` | Filtrar auditoría por recurso. |
| GET | `/auditoria/rango` | Filtrar auditoría por rango de fechas. |


## Base de datos, archivos e imágenes

### MongoDB

La base de datos principal se ejecuta en Docker usando MongoDB 7.0.

Puerto local:

```text
27017
```

Nombre de base de datos por variable:

```env
MONGO_DATABASE=petdate
```

### Imágenes

El sistema usa un volumen compartido llamado:

```text
petdate-uploads
```

Este volumen es utilizado por microservicios que cargan imágenes y por el servidor Nginx `imagen-server`, que permite servir archivos desde el backend.

### Respaldos automáticos

El servicio `mongo-backup` realiza respaldos mediante `mongodump` y los almacena en:

```text
Proyecto/Data/backups/
```

El proceso genera archivos comprimidos `.gz` y elimina respaldos antiguos según la configuración del contenedor.


## Seguridad

El sistema implementa autenticación mediante JWT.

### Flujo general

```text
1. El usuario inicia sesión.
2. El backend genera un JWT.
3. El frontend guarda el token en localStorage.
4. Cada petición protegida envía Authorization: Bearer <token>.
5. El API Gateway valida el token.
6. El Gateway propaga identidad y rol hacia los microservicios.
7. El microservicio procesa la solicitud si corresponde.
```

### Roles principales

| Rol | Uso |
|---|---|
| USER | Usuario dueño de mascota. |
| SERVICIO | Empresa o proveedor. |
| ADMIN | Administrador del sistema. |

### Medidas consideradas

- Validación de credenciales.
- Uso de tokens JWT.
- Separación de rutas públicas y protegidas.
- Restricción de panel administrativo.
- Auditoría de operaciones en el Gateway.
- Variables sensibles fuera del código fuente.
- Validaciones en formularios y backend.
- Recuperación de contraseña por correo.
- Consentimiento informado para política de privacidad en registro de usuario.


## Pruebas funcionales

Para la Evaluación Parcial 3, las pruebas se trabajan bajo un enfoque funcional global. Esto significa que se valida el sistema desde la experiencia del usuario en la interfaz web, comprobando que la acción realizada en el frontend sea procesada correctamente por el backend y reflejada en el sistema.

### Enfoque de pruebas

- Pruebas manuales desde la web.
- Validación por actor: dueño de mascota, empresa y administrador.
- Evidencias mediante capturas de pantalla.
- Registro de resultados en planilla Excel.
- Asociación de cada evidencia al código del caso de prueba.

### Ejemplos de casos de prueba

| Código | Actor | Funcionalidad | Resultado esperado |
|---|---|---|---|
| CP-001 | Dueño de mascota | Registro con datos válidos | El sistema registra correctamente al usuario. |
| CP-002 | Dueño de mascota | Registro con campos incompletos | El sistema muestra validación o impide continuar. |
| CP-003 | Dueño de mascota | Inicio de sesión válido | El sistema permite acceder al perfil del usuario. |
| CP-004 | Dueño de mascota | Inicio de sesión inválido | El sistema muestra mensaje de error. |
| CP-005 | Dueño de mascota | Registro de mascota | La mascota queda registrada y visible. |
| CP-006 | Empresa | Registro de empresa | La empresa queda registrada correctamente. |
| CP-007 | Empresa | Login de empresa | El sistema permite acceder al panel de empresa. |
| CP-008 | Empresa | Publicar promoción | La promoción queda visible en el perfil. |
| CP-009 | Empresa | Publicar blog | El blog queda publicado correctamente. |
| CP-010 | Administrador | Login administrativo | El sistema permite ingresar al panel admin. |


## Control de versiones

El proyecto puede gestionarse mediante Git y GitHub.

Comandos básicos:

```bash
git status
git add .
git commit -m "docs: agregar README general del proyecto"
git push origin main
```

Se recomienda trabajar con ramas para separar desarrollo, correcciones y documentación:

```bash
git checkout -b docs/readme-final
```

Archivos y carpetas que no deberían versionarse:

```text
node_modules/
target/
dist/
build/
.env
*.log
Data/backups/*.gz
```

## Problemas frecuentes

### El frontend no conecta con el backend

Verificar que el API Gateway esté activo:

```bash
docker ps
```

```text
http://localhost:8080
```

También revisar que el cliente API apunte a la URL correcta.

### Error de CORS

Verificar configuración CORS en el API Gateway y que el frontend esté usando el origen permitido.

### El backend no conecta con MongoDB

Revisar:

- Que `Data/docker-compose.yml` esté levantado.
- Que exista la red `petdate-network`.
- Que las variables `MONGO_USER`, `MONGO_PASSWORD` y `MONGO_DATABASE` coincidan en `Data/.env` y `Backend/.env`.

### Error con volumen `petdate-uploads`

Levantar primero el stack de `Data/`, ya que ahí se crea el volumen compartido:

```bash
cd Proyecto/Data
docker compose up -d --build
```

Luego levantar backend.

### Login de administrador no funciona

Verificar variables:

```env
ADMIN_EMAIL=admin@petdate.cl
ADMIN_PASSWORD=password_admin
```

Estas credenciales se cargan por variable de entorno y no necesariamente se guardan como usuario común en la base de datos.

### Recuperación de contraseña no envía correo

Verificar:

- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- Contraseña de aplicación Gmail.
- Acceso a internet desde el contenedor.
- Logs del microservicio correspondiente.

## Estado del proyecto

Proyecto académico en etapa de integración, validación funcional y documentación final.

La versión actual permite demostrar los principales flujos funcionales de la plataforma mediante pruebas globales desde la interfaz web, considerando frontend, backend, base de datos y despliegue con Docker.