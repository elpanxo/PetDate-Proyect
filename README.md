# PetDate-Proyect

PetDate nace de la necesidad de centralizar los servicios para mascotas en una sola plataforma web, permitiendo a los usuarios encontrar fácilmente veterinarias, urgencias 24/7, tiendas y otros servicios relacionados, además de gestionar la información y cuidados de sus mascotas de manera más organizada y accesible.

Página web orientada a la gestión de mascotas y servicios veterinarios, desarrollada bajo una arquitectura separada entre frontend y microservicios backend.

El proyecto busca centralizar información de mascotas, usuarios y futuros servicios asociados al cuidado animal, incorporando funcionalidades de autenticación, administración de mascotas y una experiencia web moderna.


# Equipo de desarrollo

| Nombre | Rol |
|---------|------|
| Camila González | Scrum master |
| Francisco Agüero | Desarrollador frontend |
| Eliecer Salgadoo | Desarrollador Backend |


# Objetivo del Proyecto

PetDate busca entregar una plataforma moderna para la administración de mascotas y servicios relacionados, permitiendo centralizar información y mejorar la interacción entre usuarios y servicios veterinarios.

El enfoque principal del proyecto está orientado hacia:

- Organización de información de mascotas
- Escalabilidad mediante microservicios
- Arquitectura moderna desacoplada
- Facilidad de mantenimiento
- Experiencia web intuitiva

## Arquitectura del proyecto

El proyecto se encuentra dividido en tres grandes módulos:

- Frontend Web
- Backend (Microservicios)
- Configuración y datos

```
PetDate-Proyect/
│
├── Proyecto/
│   ├── Frontend/
│   ├── Backend/
│   │   ├── ms-usuarios/
│   │   └── ms-mascotas/
│   └── Data/
│
├── Documentación/
├── Gestión/
└── README.md
```

## Tecnologias utilizadas

Frontend
- React 19
- Vite
- React Router DOM
- Bootstrap 5
- React Bootstrap
- ESLint

Backend
- Java 17
- Spring Boot 4
- Spring Security
- Spring Validation
- Spring Web MVC
- MongoDB
- OpenFeign
- Swagger / OpenAPI

Base de Datos
- MongoDB

Contenedores
- Docker
- Docker Compose

# Instalación  del proyecto
1. Clonar repositorio
```
git clone <URL_DEL_REPOSITORIO>
```

2. Frontend

Entrar al directorio:
```
cd Proyecto/Frontend
```

Instalar dependencias:
```
npm install
```

Ejecutar entorno de desarrollo:
```
npm run dev
```