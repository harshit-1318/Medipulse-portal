# 04. Architecture & Zustand State Management

## 🗂️ Zustand State Management

Three global stores:

| Store | File | Purpose |
|-------|------|---------|
| `useSiteStore` | `src/store/siteStore.ts` | Site info (id, key, name, branding), persisted to localStorage |
| `useUserStore` | `src/store/userStore.ts` | Current user, token, role |
| `useGlobalLoader` | `src/store/globalLoaderStore.ts` | Global HTTP loading state (managed by apiClient interceptor) |

### Rules
- Do **not** read site ID from the store for API calls — the interceptor reads from `localStorage` directly
- Access user role via `useUserStore.getState().user?.effectiveRole` for role-based UI hiding
- Do not create new Zustand stores for per-component state — use `useState`/`useReducer` instead

---

## 📐 Source Code File Size Rule (< 100 LOC Target)

To maintain high readability, maintainability, and testability across the codebase:

- **Target Size**: All source components, hooks, services, and utilities in `src/` must target **< 100 LOC** (strict maximum limit: **150 LOC**).
- **Modularization**: If a component, hook, or service exceeds 100 LOC, extract:
  - Sub-components into separate files (e.g., `<Module>SubItem.tsx`)
  - Custom sub-hooks (e.g., `use<Feature>Data.ts`)
  - Pure helper/transformer functions into `utils/` or domain helper files.
- **Exceptions**:
  - **Unit Test Files (`*.test.ts`, `*.test.tsx`)**: Allowed to be larger to cover full test suites.
  - **Type Definitions (`src/types/`)**: Allowed to contain complete domain schemas in one place.
  - **Knowledge Base (`knowledge/`)**: Documentation and log files (`PROJECT-STATE.md`) are exempt.

---

## 📁 Module & Directory Structure

```
src/
├── api/
│   ├── apiClient.ts          ← shared axios instance (interceptors, headers)
│   └── services/             ← one file or folder per domain
├── components/               ← feature-organized React components
│   ├── <module>/
│   │   ├── <ModulePage>.tsx  ← top-level page component (< 100 LOC)
│   │   ├── hooks/            ← useQuery hooks, filter state, pagination
│   │   ├── filters/          ← filter form components
│   │   ├── table/            ← table columns, actions
│   │   └── modals/           ← modal components
├── hooks/                    ← shared cross-module hooks
├── app/                      # Next.js 16 App Router Routes
├── stores/                   ← Zustand global stores
├── styles/                   ← global CSS + Tailwind
├── test/                     ← Vitest setup
├── types/                    ← TypeScript interfaces per domain
└── utils/
    └── url/
        ├── urlBase.ts         ← getUrlParam, normalizeSortOrder
        └── orderFilterUtils.ts ← parseFiltersFromParams, getInitialOrderFilters
```
