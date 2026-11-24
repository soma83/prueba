# Usuarios y Publicaciones / JSONPlaceholder Demo

Aplicación React + TypeScript + Vite que consume la API de JSONPlaceholder (https://jsonplaceholder.typicode.com) para listar usuarios, buscar, ver sus publicaciones y crear nuevas.

## Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** (estilos, dark mode, responsive)
- **React Context + useReducer** (estado global)
- **Vitest + Testing Library** (tests unitarios e integración)
- **Oxlint** (linting rápido)

## Instalación

### Prerrequisitos

- **Node.js** ≥ 18
- **pnpm** ≥ 8 (`npm install -g pnpm`)

### Inicio rápido

```bash
# Clonar el repositorio
git clone https://github.com/soma83/prueba
cd prueba

# Instalar dependencias
pnpm install

# Variables de entorno
cp .env.example .env
# Editar .env si es necesario (VITE_API_BASE_URL=https://jsonplaceholder.typicode.com)

# Iniciar servidor de desarrollo
pnpm dev
# → http://localhost:5173
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor desarrollo con HMR |
| `pnpm build` | Build producción (typecheck + minify) |
| `pnpm preview` | Previsualizar build producción |
| `pnpm lint` | Oxlint sobre código fuente |
| `pnpm test` | **Ejecutar tests en modo watch** |
| `pnpm test:run` | **Ejecutar tests una vez (CI)** |
| `pnpm test:ui` | **Interfaz visual de tests** |

### Tests

```bash
# Modo watch (re-ejecuta al guardar)
pnpm test

# Una sola pasada (para CI/CD)
pnpm test:run

# UI visual en http://localhost:51204
pnpm test:ui
```

**Cobertura actual:** 10 tests (búsqueda, paginación, diálogo crear post, validaciones, reset formulario).

## Funcionalidades

1. **Lista de usuarios** con búsqueda en tiempo real (nombre, username, email)
2. **Selección de usuario** → muestra sus publicaciones
3. **Paginación** configurable (5/10/20/50 por página), reset al cambiar usuario
4. **Crear publicación** via diálogo modal con validación (título + cuerpo obligatorios)
5. **Estados de carga y error** visibles (skeletons, alertas)
6. **Tema** Claro / Oscuro / Sistema (persistente)
7. **Responsive**: Sidebar en desktop, expandible inline en mobile
8. **Accesibilidad**: ARIA, focus-visible, skip link, labels, roles

## Estructura del proyecto

```
src/
├── components/
│   ├── UserList.tsx        # Lista usuarios + búsqueda + expand mobile
│   ├── Posts.tsx           # Lista posts paginada
│   ├── CreatePostDialog.tsx # Modal crear publicación
│   ├── Pagination.tsx      # Controles paginación
│   └── Header.tsx          # Barra superior + menú tema/contacto
├── context/
│   └── AppContext.tsx      # React Context + useReducer (estado global)
├── hooks/
│   ├── useUsers.ts         # Carga usuarios
│   └── usePosts.ts         # Carga posts por usuario
├── services/
│   └── api.ts              # Cliente fetch tipado
├── types/
│   └── user.ts             # Interfaces User, Post, CreatePostInput
├── test/
│   └── setup.ts            # Config Vitest (mocks globales)
├── App.tsx                 # Layout principal (responsive)
├── main.tsx                # Entry point
└── index.css               # Tailwind v4 + tema + utilidades
```

## Decisiones técnicas

| Área | Decisión | Razón |
|------|----------|-------|
| Estado global | React Context + useReducer | Simple, sin deps externas, suficiente para este alcance |
| Estilos | Tailwind CSS v4 | Utility-first, dark mode nativo, bundle pequeño |
| API | `fetch` nativo + tipado | Sin dependencias (axios), JSONPlaceholder no requiere auth |
| Tests | Vitest + Testing Library | Rápido, API moderna, jsdom, compatibilidad Vite |
| Paginación | Estado en Context | Reset automático al cambiar usuario/postsPerPage |
| Diálogo | Portal + overlay | Accesible, focus trap implícito, ESC para cerrar |
| Responsive | CSS Grid + media queries | Sidebar desktop (≥1024px), inline expand mobile |
| Tema | Clase `dark` en `<html>` | Tailwind `dark:` variant, respeta `prefers-color-scheme` |

## Qué mejoraría con más tiempo

- **React Query / SWR** para cache, revalidación, optimistic updates
- **React Hook Form + Zod** para formularios más robustos
- **Storybook** para documentar componentes visualmente
- **E2E tests** con Playwright (flujos completos usuario)
- **PWA** (service worker, manifest, offline)
- **i18n** (react-i18next) para multi-idioma
- **Virtualización** (react-window) si lista usuarios crece >100
- **Error Boundary** para capturar errores de render
- **Animaciones** con Framer Motion (transiciones suaves)
- **Analytics** (eventos: búsqueda, crear post, cambio tema)

## Uso de IA en el desarrollo

Este proyecto fue desarrollado asistido por IA (Claude / Nemotron) mediante:

1. **Arquitectura inicial**: Definición de estructura, tipos, Context, hooks
2. **Componentes UI**: UserList, Posts, CreatePostDialog, Pagination, Header con Tailwind + accesibilidad
3. **Responsive & UX**: Breakpoints, mobile-first, skeletons, empty states, animaciones
4. **Tests**: 10 tests Vitest (render, interacción, validación, async, mocks)
5. **Configuración**: Vite, Tailwind v4, Vitest, tsconfig, Oxlint
6. **Refactors**: Tema persistente, paginación reset, diálogo reset, search UX
7. **Documentación**: README, comentarios, tipos estrictos

La IA actuó como **pair programmer senior**: proponiendo código, corrigiendo errores de tipos/build/tests, aplicando buenas prácticas (accesibilidad, performance, DX) y iterando rápido ante requisitos cambiantes.

## Nota final

El archivo `LEEME.md` contiene detalles técnicos y de implementación. Se describen los aspectos del proceso de desarrollo con la IA, comandos.