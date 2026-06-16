# Frontend — PetDate

Aplicación web de PetDate construida con React 19 y Vite. Consume el API Gateway en `http://localhost:8080` y gestiona la sesión del usuario mediante JWT almacenado en localStorage.

---

## Stack

| Tecnología | Versión |
|---|---|
| React | 19.2.5 |
| Vite | 8.0.10 |
| React Router DOM | 7.14.2 |
| Bootstrap | 5.3.8 |
| React Bootstrap | 2.10.10 |
| Lucide React | — |
| ESLint | — |

---

## Requisitos

- Node.js 18+
- npm 9+
- API Gateway corriendo en `http://localhost:8080`

---

## Instalación y ejecución

```bash
cd Proyecto/Frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

**Otros comandos:**

```bash
npm run build    # Genera build de producción en /dist
npm run preview  # Sirve el build de producción localmente
npm run lint     # Ejecuta ESLint
```

---

## Rutas de la aplicación

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio / landing |
| `/login` | Inicio de sesión de usuarios |
| `/register` | Registro de nuevo usuario |
| `/login-empresa` | Inicio de sesión de empresas |
| `/recuperar-contrasena` | Reset de contraseña (usuarios) |
| `/recuperar-contrasena-empresa` | Reset de contraseña (empresas) |
| `/servicios` | Listado de servicios veterinarios |
| `/servicios/:id` | Detalle de un servicio |
| `/mis-mascotas` | Gestión de mascotas del usuario |
| `/mis-mascotas/:id` | Detalle y edición de una mascota |
| `/mi-empresa` | Panel de control de la empresa |
| `/blogs` | Listado de publicaciones |
| `/comentarios` | Reseñas y comentarios |
| `/contacto` | Formulario de contacto |
| `/nosotros` | Página "Acerca de" |
| `/politica-privacidad` | Política de privacidad |

---

## Estructura de carpetas

```
src/
├── api/
│   └── petdate-api.js          # Cliente HTTP centralizado
├── components/
│   ├── login/                  # Login, Register, recuperación de contraseña
│   ├── navbar/                 # Barras de navegación
│   ├── home/                   # Página de inicio
│   ├── misMascotas/            # Gestión de mascotas
│   ├── servicios/              # Listado y detalle de servicios
│   ├── blogs/                  # Blog
│   ├── comentarios/            # Reseñas y comentarios
│   ├── contacto/               # Formulario de contacto
│   ├── miEmpresa/              # Dashboard de empresa
│   ├── nosotros/               # Página institucional
│   ├── footer/                 # Pie de página
│   └── politicaPrivacidad/     # Política de privacidad
├── assets/
│   ├── logo/                   # Logotipos de la marca
│   └── roots/                  # Imágenes generales
├── App.jsx                     # Configuración de rutas (React Router)
└── main.jsx                    # Punto de entrada
```

---

## Cliente API (`petdate-api.js`)

Todas las llamadas al backend pasan por este módulo. Expone los siguientes namespaces:

| Namespace | Descripción |
|---|---|
| `auth` | Login y recuperación de contraseña |
| `usuarios` | CRUD de usuarios y subida de foto |
| `mascotas` | CRUD de mascotas e imágenes |
| `servicios` | CRUD de servicios, promociones y blogs |
| `citas` | Agendamiento y gestión de citas |
| `comentarios` | Reseñas de servicios y comentarios de blogs |
| `contacto` | Envío del formulario de contacto |

**Gestión del token:**
- El JWT se guarda en `localStorage` tras el login.
- Cada petición protegida incluye automáticamente `Authorization: Bearer <token>`.
- El módulo decodifica el payload JWT en el cliente para leer `usuarioId` y `rol`.

---

## Variables de entorno

Crear un archivo `.env` en `Proyecto/Frontend/` si se necesita cambiar la URL del gateway:

```env
VITE_API_URL=http://localhost:8080
```

Por defecto el cliente apunta a `http://localhost:8080`.
