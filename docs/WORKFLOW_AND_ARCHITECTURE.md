# 🚀 MediPulse End-to-End Workflow & Architecture Guide

Quick-reference document explaining how **Frontend** and **Backend** communicate file-by-file in MediPulse.

---

## 📊 1. Visual Flowchart (Overall Workflow)

```mermaid
graph TD
    A["👤 User Action (e.g. Navigates to /orders/all)"] --> B["🛡️ Middleware (src/middleware.ts)"]
    
    subgraph Security & Access
        B -->|"Token Missing"| B1["🚪 Redirect to /login"]
        B -->|"Role = super_admin on /dashboard"| B2["🔄 Redirect to /super-dashboard"]
        B -->|"Authorized"| C["📱 App Shell (src/app/layout.tsx)"]
    end

    subgraph Tenant & Global State
        C --> D["⚙️ QueryProvider (src/components/providers/QueryProvider.tsx)"]
        D --> E["🏢 Initialize Site (src/store/site/siteStore.ts)"]
        E -->|"Reads Host / Sets Headers"| E1["📦 LocalStorage (X-SITE-ID, X-SITE-KEY)"]
    end

    subgraph UI & Data Fetching Layer
        D --> F["📄 Page Component (src/app/(dashboard)/orders/all/page.tsx)"]
        F --> G["🎨 Feature View (src/components/orders-table/views/AllOrdersView.tsx)"]
        G --> H["🪝 TanStack Query Hook (useAllOrdersData.ts)"]
        H <-->|"Sync Filters with URL"| H1["🔗 URL Sync Hook (src/hooks/url/useUrlSync.ts)"]
    end

    subgraph API & Network Layer
        H --> I["📡 Domain Service (src/api/services/orders/fetchers/all.ts)"]
        I --> J["🔌 API Client Wrapper (src/api/apiClient.ts)"]
        J --> K["⚙️ Axios Interceptors (src/lib/api/interceptors.ts)"]
        
        K -->|"1. Start Loader Animation"| K1["⏳ Global Loader Store (src/store/loader/)"]
        K -->|"2. Inject Bearer Token"| K2["🍪 Cookie (token)"]
        K -->|"3. Inject Tenant Headers"| K3["🏢 Headers (X-SITE-ID, X-SITE-KEY)"]
    end

    subgraph Next.js Proxy & Backend
        K --> L["🔀 Next.js Proxy Rewrite (next.config.mjs: /api/*)"]
        L --> M["🖥️ NestJS Backend API (:5000)"]
        M -->|"Returns JSON Data"| L
        L --> K
    end

    subgraph Response Processing & UI Update
        K -->|"Stop Loader Animation"| K1
        K -->|"Check 401 Unauthorized"| N["🚨 If 401 -> Auto Logout & Redirect"]
        K -->|"Unwrap Data"| I
        I --> H
        H --> G
        G --> O["✨ Display UI (OrderTable.tsx & Rows)"]
    end
```

---

## 🔄 2. File-to-File Step-by-Step Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 User / Doctor
    participant Middleware as 🛡️ src/middleware.ts
    participant Page as 📄 src/app/(dashboard)/orders/all/page.tsx
    participant UI as 🎨 src/components/orders-table/
    participant Hook as 🪝 useAllOrdersData.ts
    participant Service as 📡 src/api/services/orders/
    participant Interceptor as 🔌 src/lib/api/interceptors.ts
    participant NextProxy as 🔀 next.config.mjs (/api/*)
    participant Backend as 🖥️ NestJS Server (:5000)
    participant Store as 🗄️ src/store/ (Zustand)

    User->>Middleware: 1. Requests URL "/orders/all"
    Note over Middleware: Checks 'token' & 'role' in Cookies
    Middleware-->>Page: 2. Passes request (Authorized)

    Page->>UI: 3. Renders AllOrdersView.tsx
    UI->>Hook: 4. Calls useAllOrdersData(filters, page)
    Hook->>Service: 5. Calls getAllOrders(params)
    Service->>Interceptor: 6. apiClient.get('/orders', { params })

    Note over Interceptor: Attaches Bearer JWT + X-SITE-* headers
    Interceptor->>Store: 7. useGlobalLoader.start() (Show loader)
    Interceptor->>NextProxy: 8. GET /api/orders?page=1&status=all
    NextProxy->>Backend: 9. Proxy to http://localhost:5000/orders
    
    Backend-->>NextProxy: 10. JSON: { status: "SUCCESS", data: { items: [...] } }
    NextProxy-->>Interceptor: 11. Response returned
    Interceptor->>Store: 12. useGlobalLoader.stop() (Hide loader)
    
    Interceptor-->>Service: 13. Returns parsed items array
    Service-->>Hook: 14. TanStack Query caches data
    Hook-->>UI: 15. State updates with order items
    UI-->>User: 16. Displays rendered table rows & pagination
```

---

## 📁 3. Directory Responsibilities Cheat Sheet

| Folder | What It Does | Example Files |
|---|---|---|
| **`src/app/`** | Next.js App Router route pages & layouts | `src/app/(dashboard)/orders/all/page.tsx` |
| **`src/middleware.ts`** | Security gatekeeper (cookies, token, RBAC redirects) | `src/middleware.ts` |
| **`src/components/`** | Visual UI components (tables, modals, cards, forms) | `src/components/orders-table/views/AllOrdersView.tsx` |
| **`src/hooks/`** | Shared React hooks (debounce, search, URL sync) | `src/hooks/url/useUrlSync.ts` |
| **`src/store/`** | Global state management via Zustand | `src/store/user/`, `src/store/site/`, `src/store/loader/` |
| **`src/api/services/`** | Clean business API endpoints | `src/api/services/orders/`, `src/api/services/customer/` |
| **`src/api/apiClient.ts`** | Axios HTTP client singleton | `src/api/apiClient.ts`, `src/lib/api/interceptors.ts` |
| **`src/types/`** | TypeScript interface definitions | `src/types/customer/`, `src/types/prescription/` |
| **`src/utils/`** | Pure helper functions | `src/utils/auth/`, `src/utils/url/`, `src/utils/branding/` |
| **`next.config.mjs`** | Proxies `/api/*` requests to NestJS Backend (`:5000`) | `next.config.mjs` |

---

## 🔑 4. Key Concepts You Should Know

### 1. Authentication (JWT Token)
* Token is stored in a cookie named `token` (and mirrored in `localStorage` as `accessToken`).
* On every API request, [`interceptors.ts`](../src/lib/api/interceptors.ts) automatically extracts this token and sends:
  `Authorization: Bearer <token>`.

### 2. Multi-Tenant Site Detection
* When a user visits the portal from any domain (e.g. `clinic1.medipulse.co.uk` or `localhost`), the frontend detects the domain via [`siteStore.ts`](../src/store/site/siteStore.ts).
* It saves `X-SITE-ID`, `X-SITE-KEY`, and `X-SITE-HOST` in `localStorage`.
* Every outgoing API request automatically includes these headers so the backend knows which tenant's database to query.

### 3. Automatic CORS Avoidance (Next.js Rewrites)
* In [`next.config.mjs`](../next.config.mjs), any request to `/api/:path*` is automatically proxied to `${NEXT_PUBLIC_API_BASE_URL}/:path*` (`http://localhost:5000`).
* Browser sees same-origin requests (`/api/...`), so **CORS errors never occur**.

### 4. Server State vs Client State
* **TanStack Query (`@tanstack/react-query`)**: Handles all backend data (orders, users, leads, customers). Caches data, handles refetching, and provides loading/error states.
* **Zustand (`src/store/`)**: Handles client-only global states (current user login, current site branding, global progress bar).
