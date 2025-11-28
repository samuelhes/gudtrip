# Arquitectura del Sistema - gudtrip

## 1. Visión General
**gudtrip** es una plataforma web de carpooling P2P (Peer-to-Peer) diseñada como un marketplace que conecta conductores y pasajeros. El núcleo del sistema es la confianza (reputación) y la economía interna basada en tokens virtuales.

## 2. Stack Tecnológico

### 2.1. Frontend Web (Cliente)
- **Framework**: React (con Vite para build tool rápido).
- **Lenguaje**: TypeScript.
- **Estilos**: CSS Moderno (Variables, Flexbox/Grid) para diseño premium y responsivo.
- **Estado**: React Context + Hooks (para gestión ligera) o Zustand.
- **Data Fetching**: Axios o Fetch API con manejo centralizado de errores.
- **Routing**: React Router v6.

### 2.2. Backend (Modular / Microservicios)
- **Runtime**: Node.js (TypeScript).
- **Framework**: NestJS (Arquitectura modular, inyección de dependencias, escalable).
- **API**: REST (principal) + WebSockets (notificaciones en tiempo real).
- **Autenticación**: JWT (Access + Refresh Tokens) con Cookies HttpOnly para seguridad web.

### 2.3. Base de Datos y Almacenamiento
- **Base de Datos Relacional**: PostgreSQL.
    - *Integridad*: ACID para transacciones de tokens y reservas.
- **Caché / Colas**: Redis.
    - *Uso*: Sesiones, rate limiting, colas de emails.

## 3. Estructura del Monorepo
```
gudtrip/
├── apps/
│   ├── web/              # Aplicación Web (React)
│   ├── api/              # Backend (NestJS)
│   └── admin/            # Panel de administración (React) - Futuro
├── libs/                 # Librerías compartidas (interfaces DTOs, utilidades)
├── docker/               # Infraestructura local (Docker Compose)
└── docs/                 # Documentación
```

## 4. Módulos del Backend (Dominios)
*(Sin cambios respecto a la versión anterior, el backend es agnóstico del cliente)*

- **Identity & Access**: Auth, Perfiles, Roles.
- **Rides**: Publicación, Búsqueda (filtros avanzados).
- **Booking**: Máquina de estados de reservas, bloqueo de cupos.
- **Wallet**: Ledger de tokens, transacciones atómicas.
- **Reputation**: Sistema de reviews.
- **Notifications**: Emails transaccionales.

## 5. Modelo de Datos (Entidades Core)
*(Mismo modelo relacional robusto)*

## 6. Flujos Críticos Web

### 6.1. Experiencia de Usuario (UX)
- **Landing Page**: Búsqueda inmediata (Origen, Destino, Fecha).
- **Dashboard**: Vista dual (Pasajero / Conductor).
- **Publicación**: Wizard paso a paso para conductores.
- **Responsive**: Diseño "Mobile-First" para que funcione perfecto en navegadores móviles.

### 6.2. Seguridad Web
- **CSRF Protection**: Tokens anti-CSRF.
- **XSS Prevention**: Sanitización de inputs en React.
- **Secure Cookies**: Almacenamiento seguro de JWT.

## 7. Plan de Implementación
1. **Setup**: Monorepo, Docker (Postgres/Redis).
2. **Backend Core**: Auth, Usuarios, Wallet básica.
3. **Frontend Base**: Layout, Auth UI, Diseño UI Kit.
4. **Feature: Publicar y Buscar**: Ciclo completo de viaje.
5. **Feature: Reservas y Pagos**: Lógica de tokens.
