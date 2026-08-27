# 🍳 Recipe Finder API

API REST para una aplicación fullstack de recetas, con autenticación JWT de doble token, favoritos por usuario y una capa propia sobre la API de Spoonacular.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Puesta en Marcha](#-puesta-en-marcha)
- [Arquitectura General](#-arquitectura-general)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Formato de Respuesta](#-formato-de-respuesta)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Flujo de Autenticación](#-flujo-de-autenticación)
- [Buenas Prácticas Implementadas](#-buenas-prácticas-implementadas)
- [Pendientes Conocidos](#-pendientes-conocidos)

## 🎯 Descripción del Proyecto

Recipe Finder API es una API RESTful que da servicio al frontend de Recipe Finder. Implementa un sistema de autenticación JWT completo con access token y refresh token persistido, gestiona los favoritos de cada usuario y actúa como proxy hacia Spoonacular.

Ese proxy es deliberado: **la API key de Spoonacular vive solo en el backend** y nunca llega al navegador. El frontend jamás llama a Spoonacular directamente.

### Características Principales

- ✅ Autenticación con JWT (access token + refresh token)
- ✅ Refresh tokens persistidos en MongoDB, con TTL de 7 días
- ✅ Invalidación real de sesiones en el logout
- ✅ Protección de rutas privadas con middleware
- ✅ Favoritos por usuario, sin duplicados (índice único)
- ✅ Búsqueda de recetas con filtros (cocina, dieta, tiempo, orden)
- ✅ Detalle de receta enriquecido con información nutricional
- ✅ Caché en memoria de 5 h para las recetas populares
- ✅ TypeScript en modo `strict`

## 🛠 Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express 5
- **Lenguaje**: TypeScript (`strict`)
- **Base de Datos**: MongoDB
- **ODM**: Mongoose
- **Autenticación**: JWT (HS256)
- **Hashing**: bcrypt
- **API externa**: Spoonacular
- **CORS**: middleware `cors`

### Dependencias Principales

```json
{
  "express": "^5.2.1",
  "mongoose": "^9.2.1",
  "jsonwebtoken": "^9.0.3",
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1"
}
```

La validación de entrada se hace a mano en cada ruta; no se usa ninguna librería de validación.

## 🚀 Puesta en Marcha

### Requisitos

- Node.js 18 o superior (se usa el `fetch` nativo)
- Una instancia de MongoDB (local o Atlas)
- Una API key de [Spoonacular](https://spoonacular.com/food-api)

### Instalación

```bash
cd recipe-finder-backend
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz del backend. **No se sube al repositorio** (está en `.gitignore`).

```bash
DB_CONNECTION_STRING=mongodb://localhost:27017/recipe-finder
ACCESS_TOKEN_SECRET=<cadena larga y aleatoria>
REFRESH_TOKEN_SECRET=<otra cadena larga y distinta>
SPOONACULAR_API_KEY=<tu api key>
PORT=5000
```

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `DB_CONNECTION_STRING` | Sí | Cadena de conexión a MongoDB. Sin ella el proceso termina al arrancar. |
| `ACCESS_TOKEN_SECRET` | Sí | Secreto para firmar y verificar el access token. |
| `REFRESH_TOKEN_SECRET` | Sí | Secreto para el refresh token. Debe ser distinto al anterior. |
| `SPOONACULAR_API_KEY` | Sí | Key de Spoonacular. Solo se usa en `spoonacular.service.ts`. |
| `PORT` | No | Puerto del servidor. Por defecto `5000`. |

Genera los secretos con algo como `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.

### Arranque

```bash
npm run dev
```

El servidor queda en `http://localhost:5000` y todas las rutas cuelgan de `/api`.

## 🏗 Arquitectura General

```
📁 src/
├── 📁 auth/          # Middleware y utilidades JWT
├── 📁 lib/           # Utilidades compartidas
├── 📁 routes/        # Un archivo por recurso
├── 📁 schema/        # Modelos de Mongoose
├── 📁 services/      # Integraciones externas (Spoonacular)
├── 📁 types/         # Tipos y augmentation de Express
└── 📄 app.ts         # Punto de entrada
```

### Principios Arquitectónicos

- **Un archivo por recurso**: cada ruta vive en su propio módulo y se registra en `routes/index.ts`.
- **Servicios aislados**: las llamadas a Spoonacular están encapsuladas en `services/spoonacular.service.ts`. Las rutas nunca hacen `fetch` a la API externa por su cuenta.
- **Middleware pattern**: `authenticate` protege los endpoints privados.
- **Lógica en el modelo**: el hashing de contraseñas y la creación de tokens viven como middleware y métodos del esquema de usuario.

### Flujo para añadir una función de recetas

1. Añade o extiende la lógica en `services/spoonacular.service.ts`.
2. Expónla en la ruta correspondiente de `routes/`.
3. Consúmela desde `recipe.service.ts` en el frontend.

## 🔐 Sistema de Autenticación

### Arquitectura JWT

Sistema de doble token:

1. **Access Token**: dura 1 hora, se envía en cada petición protegida.
2. **Refresh Token**: dura 7 días, sirve para pedir un access token nuevo.

Ambos se firman con HS256 y llevan el payload `{ user: { id, email, name } }`.

### Características de Seguridad

- **Hashing de contraseñas**: bcrypt con 10 salt rounds, aplicado en un `pre("save")` del esquema.
- **Persistencia de refresh tokens**: se guardan en MongoDB, con índice único y TTL de 7 días que coincide con la vida del JWT.
- **Invalidación de sesiones**: el logout borra el refresh token de la base, así que deja de servir de verdad.
- **Doble verificación en el refresh**: el token debe existir en la base *y* ser un JWT válido.
- **Prevención de user enumeration**: el login responde `Invalid credentials` tanto si el email no existe como si la contraseña falla.

## 📁 Estructura del Proyecto

```
recipe-finder-backend/
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 .gitignore
├── 📄 readme.md
└── 📁 src/
    ├── 📄 app.ts                    # Configuración de Express y conexión a Mongo
    ├── 📁 auth/
    │   ├── 📄 authenticate.ts       # Middleware de rutas protegidas
    │   ├── 📄 generateTokens.ts     # Firma de access y refresh tokens
    │   ├── 📄 getTokenFromHeader.ts # Extrae el Bearer token
    │   └── 📄 verifyToken.ts        # Verificación de ambos tokens
    ├── 📁 lib/
    │   ├── 📄 getUserInfo.ts        # Documento de usuario → payload del JWT
    │   └── 📄 jsonresponse.ts       # Envoltorio { status, body }
    ├── 📁 routes/
    │   ├── 📄 index.ts              # Registro central de rutas
    │   ├── 📄 register.ts
    │   ├── 📄 login.ts
    │   ├── 📄 refresh-token.ts
    │   ├── 📄 signout.ts
    │   ├── 📄 user.ts
    │   ├── 📄 recipes.ts            # Proxy de Spoonacular + caché
    │   ├── 📄 favorites.ts          # Favoritos (protegido)
    │   └── 📄 todos.ts              # Endpoint de ejemplo
    ├── 📁 schema/
    │   ├── 📄 user.ts               # Usuario + hashing + métodos de token
    │   ├── 📄 token.ts              # Refresh tokens con TTL
    │   └── 📄 favorite.ts           # Favoritos, único por (userId, recipeId)
    ├── 📁 services/
    │   └── 📄 spoonacular.service.ts # Única consumidora de la API key
    └── 📁 types/
        ├── 📄 auth.type.ts          # AuthUser
        └── 📄 express.d.ts          # Añade req.user a Express
```

## 📜 Scripts Disponibles

```bash
npm run dev         # Desarrollo con hot-reload (ts-node-dev, sin type-check)
npm run build       # Compila TypeScript a dist/
npm start           # Ejecuta dist/app.js
npm run type-check  # tsc --noEmit
```

> `npm run dev` usa `--transpile-only`, así que **no verifica tipos**. Pasa `npm run type-check` antes de commitear.

No hay runner de tests configurado en este paquete.

## 📦 Formato de Respuesta

La API tiene hoy **dos formatos distintos** según la ruta. Es importante tenerlo presente al consumirla:

**Rutas de autenticación y usuario** (`/register`, `/login`, `/refresh-token`, `/signout`, `/user`) envuelven la carga en `jsonresponse`:

```json
{
  "status": 200,
  "body": { "...": "datos reales aquí" }
}
```

**Rutas de recetas, favoritos y todos** (`/recipes`, `/favorites`, `/todos`) devuelven el JSON directamente, sin envoltorio.

Los ejemplos de abajo reflejan la forma real de cada respuesta.

## 📡 Endpoints de la API

Todas las rutas cuelgan de `/api`.

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/register` | — | Crea una cuenta |
| `POST` | `/api/login` | — | Inicia sesión y devuelve los tokens |
| `POST` | `/api/refresh-token` | Refresh | Renueva el access token |
| `DELETE` | `/api/signout` | Refresh | Cierra sesión e invalida el refresh token |
| `GET` | `/api/user` | Access | Datos del usuario autenticado |
| `GET` | `/api/recipes` | — | Busca recetas con filtros |
| `GET` | `/api/recipes/popular` | — | Recetas populares (con caché) |
| `GET` | `/api/recipes/:id` | — | Detalle de una receta |
| `GET` | `/api/favorites` | Access | Favoritos del usuario |
| `POST` | `/api/favorites` | Access | Añade un favorito |
| `DELETE` | `/api/favorites/:id` | Access | Elimina un favorito |
| `GET` | `/api/todos` | — | Endpoint de ejemplo |
| `GET` | `/health` | — | Health check |

### Autenticación

#### Registro de Usuario

```http
POST /api/register
Content-Type: application/json

{
  "name": "Test Recipe",
  "email": "testrep@gmail.com",
  "password": "test1234",
  "confirmPassword": "test1234"
}
```

**Respuesta (201):**

```json
{
  "status": 201,
  "body": { "message": "User Created Successfully" }
}
```

Errores: `400` si faltan campos, si las contraseñas no coinciden o si el email ya existe.

#### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "testrep@gmail.com",
  "password": "test1234"
}
```

**Respuesta (200):**

```json
{
  "status": 200,
  "body": {
    "user": {
      "id": "user_id",
      "name": "Test Recipe",
      "email": "testrep@gmail.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Errores: `400` con `Invalid credentials` si el email o la contraseña fallan.

#### Refresh Token

```http
POST /api/refresh-token
Authorization: Bearer <refresh_token>
```

**Respuesta (200):**

```json
{
  "status": 200,
  "body": { "accessToken": "eyJhbGciOiJIUzI1NiIs..." }
}
```

Errores: `401` si falta el token, no está en la base o el JWT no es válido.

#### Logout

```http
DELETE /api/signout
Authorization: Bearer <refresh_token>
```

**Respuesta (200):**

```json
{
  "status": 200,
  "body": { "message": "Token eliminado correctamente" }
}
```

### Usuario (protegido)

```http
GET /api/user
Authorization: Bearer <access_token>
```

**Respuesta (200):**

```json
{
  "status": 200,
  "body": {
    "id": "user_id",
    "email": "testrep@gmail.com",
    "name": "Test Recipe"
  }
}
```

### Recetas

Estas rutas son públicas y devuelven el JSON sin envoltorio.

#### Buscar recetas

```http
GET /api/recipes?query=pasta&cuisine=italian&diet=vegetarian&sort=Popularity&maxReadyTime=30
```

| Parámetro | Descripción |
| --- | --- |
| `query` | Texto de búsqueda |
| `cuisine` | Tipo de cocina. El valor `All Categories` se ignora |
| `diet` | Dieta de Spoonacular (`vegetarian`, `vegan`, …) |
| `sort` | Preset: `Popularity`, `Healthy` o `Fast` |
| `maxReadyTime` | Minutos máximos. `sort=Fast` lo fija en 20 y tiene prioridad |

Los presets de `sort` se traducen a parámetros de Spoonacular: `Popularity` → `sort=popularity`, `Healthy` → `diet=healthy` (solo si no mandaste `diet`), `Fast` → `maxReadyTime=20`.

#### Recetas populares

```http
GET /api/recipes/popular
```

Devuelve 12 recetas aleatorias. El resultado se cachea en memoria durante 5 horas para no gastar la cuota de Spoonacular. Si la llamada falla y hay caché previa, se devuelve la caché en vez de un error.

> La caché es una variable de módulo: se pierde en cada reinicio y no se comparte entre instancias.

#### Detalle de receta

```http
GET /api/recipes/:id
```

Combina en paralelo `information` y `nutritionWidget` de Spoonacular y devuelve una forma ya adaptada al frontend:

```json
{
  "id": 12345,
  "title": "Pasta Carbonara",
  "image": "https://...",
  "summary": "Texto sin etiquetas HTML",
  "readyInMinutes": 30,
  "servings": 4,
  "extendedIngredients": [],
  "analyzedInstructions": [],
  "nutrition": { "calories": "550", "protein": "25g", "carbs": "60g", "fat": "22g" }
}
```

`nutrition` es `null` si esa llamada falla; el detalle se devuelve igualmente. Un `:id` no numérico responde `400`.

### Favoritos (protegido)

Todas requieren `Authorization: Bearer <access_token>`. Devuelven el JSON sin envoltorio.

```http
GET /api/favorites
```

```http
POST /api/favorites
Content-Type: application/json

{
  "id": 12345,
  "title": "Pasta Carbonara",
  "image": "https://..."
}
```

Si la receta ya está guardada responde `200` con `{ "message": "Already exists" }` en lugar de un error: el endpoint es idempotente. Un `id` no numérico responde `400`.

```http
DELETE /api/favorites/:id
```

Donde `:id` es el `recipeId` de Spoonacular, no el `_id` de Mongo. Responde `{ "success": true }`.

## 🔄 Flujo de Autenticación

### 1. Registro

1. El cliente envía los datos de registro.
2. El servidor valida los campos y comprueba que el email no exista.
3. El `pre("save")` del esquema hashea la contraseña con bcrypt.
4. El usuario se guarda y se responde `201`.

### 2. Login

1. El cliente envía las credenciales.
2. El servidor busca al usuario y compara la contraseña con bcrypt.
3. Genera el access token (1 h) y el refresh token (7 d).
4. El refresh token se guarda en la colección `tokens`. Si ese guardado falla, el login devuelve `500` en vez de una sesión rota.
5. Se envían ambos tokens al cliente.

### 3. Acceso a recursos protegidos

1. El cliente manda el access token en la cabecera `Authorization`.
2. `authenticate` extrae el Bearer token y lo verifica.
3. Si es válido rellena `req.user` y continúa; si no, responde `401`.

### 4. Refresh

1. El cliente envía el refresh token.
2. El servidor comprueba que exista en la base.
3. Verifica la firma del JWT y que el payload traiga un usuario.
4. Firma y devuelve un access token nuevo.

### 5. Logout

1. El cliente envía el refresh token.
2. El servidor lo borra de la base.
3. La sesión queda invalidada aunque el JWT siga sin expirar.

## ✨ Buenas Prácticas Implementadas

### Seguridad

- **Hashing seguro**: bcrypt con salt rounds en un hook del modelo, nunca en las rutas.
- **Secretos separados**: access y refresh usan secretos distintos.
- **La API key no sale del servidor**: `SPOONACULAR_API_KEY` solo se lee en el servicio, y nunca se registra en los logs.
- **Mensajes genéricos**: el login no revela si el email existe.
- **Validación de entrada**: los ids se validan antes de llegar a Mongoose, así un dato inválido es `400` y no un `500`.

### Código

- **TypeScript en `strict`**: incluida la augmentation de `Request` para tipar `req.user`.
- **Separación de responsabilidades**: rutas, servicios, modelos y utilidades separados.
- **Middlewares reutilizables**: `authenticate`, CORS y parseo de JSON.

### Base de Datos

- **Índices únicos**: en el email del usuario, en el token y en el par `(userId, recipeId)` de favoritos.
- **TTL en refresh tokens**: la colección se limpia sola a los 7 días.
- **Conexión robusta**: si falla la conexión a Mongo el proceso termina en vez de servir peticiones rotas.

## 🚧 Pendientes Conocidos

Cosas a resolver antes de un despliegue en producción:

- **CORS abierto**: `app.use(cors())` acepta cualquier origen. Habría que pasar una allowlist.
- **Sin manejador global de errores ni 404**: un error async no capturado devuelve el stack trace HTML por defecto de Express, que filtra rutas internas del servidor.
- **Formato de respuesta inconsistente**: unas rutas usan `jsonresponse` y otras no (ver [Formato de Respuesta](#-formato-de-respuesta)).
- **Sin rate limiting** en los endpoints de autenticación.
- **Sin rotación de refresh tokens**: al refrescar se reutiliza el mismo refresh token.
- **Sin tests**.

---

📧 Para preguntas o sugerencias, no dude en contactarme.
