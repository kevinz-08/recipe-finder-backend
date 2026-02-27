# 🍳 Recipe Finder API

Una API REST robusta y escalable para una aplicación fullstack de recetas, construida con autenticación JWT segura y arquitectura separada frontend/backend.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura General](#-arquitectura-general)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Flujo de Autenticación](#-flujo-de-autenticación)
- [Buenas Prácticas Implementadas](#-buenas-prácticas-implementadas)

## 🎯 Descripción del Proyecto

Recipe Finder API es una API RESTful que proporciona servicios backend para una aplicación de búsqueda y gestión de recetas. Implementa un sistema de autenticación JWT completo con tokens de acceso y refresh, permitiendo una gestión segura de sesiones de usuario. La API está diseñada para ser escalable, mantenible y fácil de integrar con aplicaciones frontend.

### Características Principales

- ✅ Autenticación segura con JWT (Access Token + Refresh Token)
- ✅ Persistencia de refresh tokens en base de datos
- ✅ Invalidación real de sesiones
- ✅ Protección de rutas privadas con middleware
- ✅ Tipado progresivo con TypeScript
- ✅ Manejo consistente de errores
- ✅ Arquitectura escalable y modular

## 🛠 Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: MongoDB
- **ODM**: Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Hashing**: bcrypt
- **Validación**: Express Validator (implícito en rutas)
- **CORS**: cors middleware

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

## 🏗 Arquitectura General

La API sigue una arquitectura modular con separación clara de responsabilidades:

```
📁 src/
├── 📁 auth/          # Utilidades de autenticación
├── 📁 lib/           # Utilidades compartidas
├── 📁 routes/        # Definición de endpoints
├── 📁 schema/        # Modelos de Mongoose
├── 📁 types/         # Definiciones TypeScript
└── 📄 app.ts         # Punto de entrada principal
```

### Principios Arquitectónicos

- **Separación de responsabilidades**: Cada módulo tiene una función específica
- **Inyección de dependencias**: Los servicios se inyectan donde se necesitan
- **Middleware pattern**: Uso extensivo de middlewares para autenticación y validación
- **Repository pattern**: Abstracción de acceso a datos a través de modelos Mongoose

## 🔐 Sistema de Autenticación

### Arquitectura JWT

La API implementa un sistema de autenticación de doble token:

1. **Access Token**: Token de corta duración (1 hora) para acceso a recursos protegidos
2. **Refresh Token**: Token de larga duración (7 días) para renovar access tokens

### Características de Seguridad

- **Hashing de contraseñas**: Uso de bcrypt con salt rounds
- **Persistencia de refresh tokens**: Almacenados en MongoDB para invalidación
- **Invalidación de sesiones**: Logout elimina refresh token de BD
- **Protección de rutas**: Middleware `authenticate` para endpoints privados
- **Prevención de user enumeration**: Mensajes genéricos en login fallido

### Flujo de Autenticación Detallado

1. **Registro**: Usuario crea cuenta → Contraseña hasheada → Usuario guardado
2. **Login**: Credenciales validadas → Tokens generados → Refresh token persistido
3. **Acceso**: Access token validado en cada request protegido
4. **Refresh**: Refresh token validado → Nuevo access token generado
5. **Logout**: Refresh token eliminado de base de datos

## 📁 Estructura del Proyecto

```
recipe-finder-backend/
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 .gitignore
├── 📁 src/
│   ├── 📄 app.ts                 # Configuración principal de Express
│   ├── 📁 auth/
│   │   ├── 📄 authenticate.ts    # Middleware de autenticación
│   │   ├── 📄 generateTokens.ts  # Generación de tokens JWT
│   │   ├── 📄 getTokenFromHeader.ts # Extracción de tokens
│   │   └── 📄 verifyToken.ts     # Verificación de tokens
│   ├── 📁 lib/
│   │   ├── 📄 getUserInfo.ts     # Utilidades de usuario
│   │   └── 📄 jsonresponse.ts    # Formateo de respuestas
│   ├── 📁 routes/
│   │   ├── 📄 index.ts           # Configuración de rutas
│   │   ├── 📄 register.ts        # Endpoint de registro
│   │   ├── 📄 login.ts           # Endpoint de login
│   │   ├── 📄 refresh-token.ts   # Endpoint de refresh
│   │   ├── 📄 signout.ts         # Endpoint de logout
│   │   ├── 📄 user.ts            # Endpoint de usuario
│   │   └── 📄 todos.ts           # Endpoint de tareas (ejemplo)
│   ├── 📁 schema/
│   │   ├── 📄 user.ts            # Modelo de Usuario
│   │   └── 📄 token.ts           # Modelo de Token
│   └── 📁 types/
│       ├── 📄 auth.type.ts       # Tipos de autenticación
│       └── 📄 express.d.ts       # Extensiones de Express
└── 📄 README.md
```

## 📜 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilación de TypeScript
npm run build

# Inicio en modo producción
npm start

# Verificación de tipos TypeScript
npm run type-check
```

## 📡 Endpoints de la API

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

**Respuesta Exitosa (201):**

```json
{
  "status": 201,
  "message": "User Created Successfully"
}
```

#### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": 200,
  "user": {
    "id": "user_id",
    "name": "Test Recipe",
    "email": "testrep@gmail.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Refresh Token

```http
POST /api/refresh-token
Authorization: Bearer <refresh_token>
```

**Respuesta Exitosa (200):**

```json
{
  "status": 200,
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout

```http
DELETE /api/signout
Authorization: Bearer <refresh_token>
```

**Respuesta Exitosa (200):**

```json
{
  "status": 200,
  "message": "Token eliminado correctamente"
}
```

### Usuario (Protegido)

#### Obtener Información de Usuario

```http
GET /api/user
Authorization: Bearer <access_token>
```

**Respuesta Exitosa (200):**

```json
{
  "status": 200,
  "id": "user_id",
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

### Todos (Ejemplo de Endpoint Protegido)

#### Obtener Todos

```http
GET /api/todos
Authorization: Bearer <access_token>
```

## 🔄 Flujo de Autenticación

### 1. Registro

1. Cliente envía datos de registro
2. Servidor valida datos y verifica usuario no existe
3. Contraseña es hasheada con bcrypt
4. Usuario es guardado en base de datos
5. Respuesta de éxito enviada

### 2. Login

1. Cliente envía credenciales
2. Servidor busca usuario por email
3. Compara contraseña hasheada
4. Genera access token (1h) y refresh token (7d)
5. Refresh token es guardado en BD
6. Tokens son enviados al cliente

### 3. Acceso a Recursos Protegidos

1. Cliente incluye access token en header Authorization
2. Middleware `authenticate` verifica token
3. Si válido, request continúa; si no, retorna 401

### 4. Refresh de Token

1. Cliente envía refresh token
2. Servidor verifica refresh token existe en BD
3. Valida refresh token JWT
4. Genera nuevo access token
5. Envía nuevo access token al cliente

### 5. Logout

1. Cliente envía refresh token
2. Servidor elimina refresh token de BD
3. Sesión es invalidada completamente

## ✨ Buenas Prácticas Implementadas

### Seguridad

- **Hashing seguro**: bcrypt con salt rounds para contraseñas
- **JWT seguro**: Secrets largos y aleatorios
- **Prevención de ataques**: Mensajes genéricos en autenticación
- **Validación de entrada**: Verificación de campos requeridos
- **CORS configurado**: Control de orígenes permitidos

### Código

- **TypeScript**: Tipado estático para mayor robustez
- **Separación de responsabilidades**: Arquitectura modular
- **Manejo de errores**: Respuestas consistentes con jsonresponse
- **Middlewares reutilizables**: authenticate, CORS, JSON parsing
- **Nombres descriptivos**: Funciones y variables autoexplicativas

### Base de Datos

- **Validación en modelo**: Mongoose middleware para hashing
- **Índices únicos**: Prevención de duplicados en email
- **Relaciones claras**: Modelos User y Token bien definidos
- **Conexión robusta**: Manejo de errores de conexión

### API Design

- **RESTful**: Endpoints siguiendo principios REST
- **Códigos HTTP apropiados**: 200, 201, 400, 401, 500
- **Respuestas consistentes**: Formato uniforme con status y message/data
- **Documentación clara**: README comprehensivo

---

📧 Para preguntas o sugerencias, no dude en contactarme.
