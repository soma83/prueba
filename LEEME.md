# LEEME - Documentación de decisiones y desarrollo asistido por IA

## Qué haría con más tiempo

- **Caché y revalidación de datos:** sustituir el hook `useUsers`/`usePosts` propio por TanStack Query (caché por usuario, reintentos, invalidación, stale-while-revalidate). Con 3 h no compensaba la dependencia.
- **Persistencia de las publicaciones creadas:** hoy viven en estado local y se pierden al recargar, porque la API no guarda. Las persistiría en `localStorage` (key por usuario) e hidratación al arrancar.
- **Con una API real:** actualización optimista con rollback al crear/editar/borrar publicaciones.
- **Editar y borrar publicaciones** (CRUD completo).
- **Accesibilidad:** auditoría automática con axe-core en CI + prueba manual con NVDA/VoiceOver.
- **Multi idioma (i18n):** react-i18next con detección de `navigator.language` y fallback.
- **CI/CD:** GitHub Actions con jobs paralelos `typecheck`, `test`, `build`, `lint` en cada push/PR; deploy a Vercel/Netlify en merge a main.
- **Sistema de diseño:** definir tokens (colores, espaciado, tipografía, radios, sombras) en `tailwind.config.ts` / CSS vars; documentar componentes en Storybook.
- **Manejo de errores:** Error Boundary global + toast notifications; mensajes diferenciados (sin conexión, 404, 422, 5xx) con reintento.
- **Testing E2E:** Playwright para flujos críticos (buscar usuario -> ver posts -> crear post -> paginar -> cambiar tema).
- **PWA:** Service Worker (Workbox), manifest, estrategias cache-first para assets y network-first para API.
- **Virtualización:** react-window si la lista de usuarios supera ~100 elementos.
- **Analytics:** eventos clave (search, create_post, theme_change, pagination_change) con Plausible/GA4.

---

## Decisiones técnicas adoptadas

| Área | Decisión | Razón |
|------|----------|-------|
| Estado global | React Context + `useReducer` | Simple, sin deps externas, suficiente para alcance actual |
| Estilos | Tailwind CSS v4 | Utility-first, dark mode nativo (`@custom-variant dark`), bundle pequeño |
| API | `fetch` nativo + tipado estricto | Sin deps (axios por ejemplo), JSONPlaceholder no requiere auth, tipado en `services/api.ts` |
| Tests | Vitest + Testing Library | Rápido, API moderna, jsdom, compatibilidad nativa con Vite |
| Paginación | Estado en Context (`postsPerPage`, `currentPage`) | Reset automático al cambiar usuario o `postsPerPage` |
| Diálogo | Portal + overlay + `role="dialog"` | Accesible, focus trap implícito, ESC para cerrar, click fuera |
| Responsive | CSS Grid + media queries (`lg:`) | Sidebar desktop (≥1024px), inline expand mobile |
| Tema | Clase `dark` en `<html>` + `matchMedia` | Tailwind `dark:` variant, respeta `prefers-color-scheme`, persiste en Context |
| Formularios | Validación nativa onBlur + onSubmit | Sin deps (RHF/Zod), campos requeridos marcados con `aria-invalid` + `aria-describedby` |
| Tipado | TypeScript strict + `verbatimModuleSyntax` | Sin `any`, `unknown` + type guards, imports type-only |

---

## Cómo usé la IA

### Herramientas

- **Claude (chat plan free):** planificar arquitectura, revisar configuración, dividir en pasos.
- **OpenCode:** ejecutar el plan paso a paso, con `AGENTS.md` de reglas y skills.
- **Modelo de OpenCode:** Nemotron 3 Ultra 550B A55B, vía proveedor NVIDIA NIM (gratuito).

### Qué le pedí

1. **A Claude:** dividir la prueba en 9 pasos con un commit por paso, para dárselo a OpenCode y revisar mi `AGENTS.md` y `opencode.json`.
2. **A OpenCode:** ejecutar cada paso del plan secuencialmente, pausando tras cada uno para validación manual.

### Qué acepté

- El plan por pasos (Vitest + Testing Library, fetch nativo, estado local, sin librerías de datos).
- Limitar los skills de OpenCode a los que aportan a una app pequeña (`web-design-guidelines`, `tdd`, `graphify`), para ahorrar tokens y latencia.
- Convención de commits.
- Regla estricta: `pnpm typecheck && pnpm test && pnpm build` antes de cada commit.

### Qué corregí o descarté

- **`.gitignore`**: OpenCode señaló que el de Vite no cubría `.env`; lo añadí.
- **`AGENTS.md` v1**: contradecía "no necesitas mi aprobación" con "pregunta ante la duda" y no incluía la regla de que JSONPlaceholder devuelve siempre `id: 101` en los POST. Lo corregí en v2.
- **Skills descartados**: `codebase-design`, `domain-modeling`, `architect` por riesgo de over-engineering en app pequeña.
- **Bugs corregidos en código de OpenCode**:
  - Tema: `matchMedia` fallaba en tests -> mock global en `src/test/setup.ts` + `@custom-variant dark` en `index.css`.
  - Paginación: controles desaparecían con 5 posts -> condición `posts.length >= 5` (siempre visibles, deshabilitados si 1 página).
  - Diálogo crear post: formulario no se reseteaba al reabrir -> `useEffect` con `isOpen` en `CreatePostDialog.tsx`.
  - Mobile: detalle inline no cerraba al volver a clickar usuario -> toggle `expandedUserId` en `UserList.tsx`.
  - Accesibilidad: `focus-visible:ring` en botones/enlaces, `aria-expanded`/`aria-controls` en items expandibles, `role="dialog"` + `aria-modal` + `aria-labelledby` en modal, skip link en `App.tsx`.
  - Tests: `window.matchMedia` undefined en jsdom -> mock en setup + `vi.hoisted` en test file.
  - Tipos: `global`/`vi` no reconocidos en test file -> `types: ["vitest/globals", "@testing-library/jest-dom"]` en `tsconfig.app.json`.

### Cómo lo verifiqué

- **Automatizado**: `pnpm typecheck` (tsc -b), `pnpm test` (Vitest 10 tests), `pnpm build` (Vite + tsc) antes de cada commit.
- **Manual**: revisión visual en `pnpm dev` (desktop ≥1024px, mobile <1024px), navegación teclado (Tab, Enter, Esc), cambio tema, búsqueda, paginación, crear post válido/inválido.
- **Diff**: revisión de `git diff` en cada commit para evitar regresiones silenciosas.

---

## Comandos útiles

```bash
pnpm install          # Instalar dependencias
pnpm dev              # Servidor desarrollo (http://localhost:5173)
pnpm build            # Build producción (typecheck + minify)
pnpm preview          # Previsualizar build
pnpm lint             # Oxlint
pnpm test             # Tests en modo watch
pnpm test:run         # Tests una pasada (CI)
pnpm test:ui          # UI visual de tests
```

## Tests

```bash
# 10 tests pasando:
# - UserList: búsqueda, loading, error (4)
# - Pagination: ≥5 posts muestra controles, <5 oculta (2)
# - CreatePostDialog: abrir, validar, crear+cerrar, reset form (4)
pnpm test:run
```

---

## Estructura del proyecto

```
src/
├── components/         # UI (UserList, Posts, CreatePostDialog, Pagination, Header)
├── context/            # AppContext (estado global + reducer)
├── hooks/              # useUsers, usePosts
├── services/           # api.ts (fetch tipado)
├── types/              # User, Post, CreatePostInput
├── test/               # setup.ts (mocks globales)
├── App.tsx             # Layout responsive
├── main.tsx            # Entry point
└── index.css           # Tailwind v4 + tema + utilidades
```

---