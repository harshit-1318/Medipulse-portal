# System Architecture Documentation — MediPulse Portal

## 1. Architectural Principles
`MediPulse Portal` is built on Next.js 16 App Router using a domain-driven hybrid architecture:

1. **Server Components First:** Initial page structures, layout wrappers, and static assets render on the server to maximize initial load speed and security.
2. **Interactive Client Boundaries:** Complex UI islands (e.g. TanStack Table filters, SurveyJS Builder, BMI stickman gauge, video player) are explicitly scoped with `'use client'`.
3. **Single API Client:** All XHR network requests route through `src/lib/api/client.ts` which automatically injects authentication tokens and multi-tenant site headers.
4. **Server State Ownership:** All server-persisted entities (orders, customers, users, activity logs, surveys) are managed exclusively via TanStack React Query v5.
5. **Global Client State Minimalization:** Client state is restricted to `userStore` (auth session), `siteStore` (domain branding & site keys), and `globalLoaderStore` (active XHR requests).

---

## 2. System Data Flow Diagram

```text
                                 ┌─────────────────────────┐
                                 │     Browser Request     │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │ Next.js Edge Middleware │
                                 │    (src/middleware.ts)  │
                                 └────────────┬────────────┘
                                              │
                                     Token & Role Verified
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │ Root Layout & Providers │
                                 │  (src/app/layout.tsx)   │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │ App Shell Layout & Side │
                                 │(src/app/(dashboard)/..) │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │ Client Feature Island   │
                                 │ (TanStack Query Hook)   │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │ Centralized API Client  │
                                 │ (src/lib/api/client.ts) │
                                 │ + Bearer Token          │
                                 │ + X-SITE-* Headers      │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │ NestJS Production API   │
                                 └─────────────────────────┘
```

---

## 3. Directory & Layer Organization

- `src/app/` — Next.js 16 App Router route hierarchy (`(auth)`, `(dashboard)`, `(public)`, `(video)`).
- `src/components/` — Modular React UI components organized by domain feature (`order-details/`, `orders-table/`, `surveys/`, `users/`, `super-admin/`).
- `src/lib/api/` — Centralized API Client (`client.ts`), interceptor logic, and response normalization helpers.
- `src/stores/` — Zustand stores for authenticated session (`userStore`), active tenant site info (`siteStore`), and global loader (`globalLoaderStore`).
- `src/utils/` — Business logic helpers (ethnicity-aware BMI threshold calculation, consultation question grouping, status resolution, date formatters).
- `src/middleware.ts` — Next.js Edge Middleware for authentication token enforcement, return URL preservation, and role-based dashboard redirection.
