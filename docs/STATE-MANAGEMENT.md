# State Management Architecture — MediPulse Portal

## 1. State Classification & Ownership

| State Tiers | Technology | Ownership & Scope | Examples |
|---|---|---|---|
| **Server State** | TanStack React Query v5 | Server entities, asynchronous queries, mutations, cache invalidation | Orders list, Order Details, Customers, Users, Surveys, Activity Logs |
| **Global Client State** | Zustand Stores | Truly global client data surviving navigation | `userStore` (session user & token), `siteStore` (site keys & logo), `globalLoaderStore` (XHR request counter) |
| **URL Search State** | Next.js `useSearchParams` | Deep-linkable UI state surviving browser refresh | Table pagination (`page`), search query (`search`), filter chips (`status`, `category`), date ranges |
| **Local Component State** | React `useState` / `useReducer` | Transient local UI interactions | Modal open toggles, dropdown open states, tab selection |

---

## 2. Zustand Store Inventory

### `userStore.ts`
- `user`: Authenticated user profile (`UserInfo`).
- `token`: Bearer token string.
- `actions.setUser`: Role normalization (`effectiveRole`).
- `actions.setToken`: Cookie & localStorage token synchronization.
- `actions.logout`: Centralized cookie/localStorage clearance & redirect to `/login`.

### `siteStore.ts`
- `siteInfo`: Partial site object (`id`, `key`, `logo`, `small_icon_url`).
- `fetchSiteInfo`: Requests `/sites/get-info-by-domain`.
- `initializeSite`: Applies site favicon & header tokens.

### `globalLoaderStore.ts`
- `activeRequests`: Set of active XHR request IDs.
- `loading`: Boolean flag indicating if any API call is in-flight.
