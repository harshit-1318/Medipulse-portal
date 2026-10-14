# MediPulse Healthcare Portal — Multi-Tenant & Multi-Site Routing Architecture Report

**Document Version:** 1.0.0  
**Domain Scope:** Multi-Tenant Domain Resolution, Header Ingestion, Tenant Isolation, Dynamic Branding  
**Framework Baseline:** Next.js 16 App Router · React 19 · Zustand 5 · Axios Interceptors · MongoDB Atlas  

---

## 1. Executive Summary

MediPulse is designed as an enterprise **multi-tenant healthcare portal**. A single deployment of the application serves multiple distinct clinical partner sites, pharmacies, and brand domains without cross-tenant data leakage.

Every tenant is identified at runtime by their unique domain (e.g., `clinic-a.com` vs `pharmacy-b.com`), automatically resolving tenant metadata (`id`, `key`, `name`, `logo`, `small_icon_url`, `themeColor`).

---

## 2. Multi-Tenant Architectural Lifecycle

```
[Browser Host Detection] ──► [fetchSiteInfo(domain)] ──► [GET /api/sites/get-info-by-domain]
                                                                        │
[Dynamic Favicon / Title] ◄── [localStorage Site Headers] ◄── [Zustand siteStore]
                                         │
                                         ▼
                            [apiClient Interceptor]
                                         │
             ┌───────────────────────────┼───────────────────────────┐
             ▼                           ▼                           ▼
      [X-SITE-ID]                 [X-SITE-KEY]                [X-SITE-HOST]
             │                           │                           │
             └───────────────────────────┼───────────────────────────┘
                                         ▼
                            [GET /api/orders, customers]
                                         │
                                         ▼
                            [MongoDB { siteId: ... }]
```

### Step 1: App Mount & Host Detection
- **Trigger:** [`src/app/(dashboard)/layout.tsx:18`](file:///D:/New%20projects/1%20MediPulse/src/app/(dashboard)/layout.tsx#L18) calls `initializeSite()` inside a `useEffect` hook on initial dashboard mount.
- **Domain Resolver:** [`src/store/site/siteActions.ts:42-45`](file:///D:/New%20projects/1%20MediPulse/src/store/site/siteActions.ts#L42-L45) inspects `window.location.host`.
- **Localhost Development Fallback:** If `currentDomain.includes('localhost')`, it defaults to `process.env.NEXT_PUBLIC_DEFAULT_SITE_HOST || 'localhost'`.

### Step 2: Site Metadata Retrieval API
- **File:** [`src/app/api/sites/get-info-by-domain/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/sites/get-info-by-domain/route.ts)
- Returns complete tenant metadata:
  ```json
  {
    "status": "SUCCESS",
    "success": true,
    "data": {
      "id": "65e0123456789abcdef00001",
      "name": "MediPulse Healthcare Portal",
      "domain": "localhost",
      "key": "site_key_local_123",
      "is_active": true,
      "logo": "/medipulse-logo.svg",
      "small_icon_url": "/favicon.svg",
      "company_name": "MediPulse",
      "settings": {
        "themeColor": "#0284c7",
        "allowRegistrations": true
      }
    }
  }
  ```

### Step 3: Zustand Store Hydration & LocalStorage Persistence
- **File:** [`src/store/site/siteStore.ts`](file:///D:/New%20projects/1%20MediPulse/src/store/site/siteStore.ts)
- Site state is preserved across page refreshes via Zustand `persist` middleware storing under `site-storage` in `localStorage`.
- Three mandatory tenant identification headers are set in `localStorage`:
  ```typescript
  localStorage.setItem('X-SITE-ID', siteInfo.id);
  localStorage.setItem('X-SITE-KEY', siteInfo.key);
  localStorage.setItem('X-SITE-HOST', currentDomain);
  ```

### Step 4: Dynamic Branding Adaptation
- **File:** `src/utils/branding.ts`
- Calls `applySiteFavicon(siteInfo.small_icon_url)`.
- Replaces `<link rel="icon">` in the document head with the tenant's custom favicon.

### Step 5: Centralized Interceptor Header Injection
- **File:** [`src/lib/api/interceptors.ts:26-33`](file:///D:/New%20projects/1%20MediPulse/src/lib/api/interceptors.ts#L26-L33)
- **Golden Rule:** Developers **never** manually attach site headers to individual API calls. The centralized Axios request interceptor injects them automatically on every non-public request:
  ```typescript
  const lsSiteId = localStorage.getItem('X-SITE-ID');
  const lsSiteKey = localStorage.getItem('X-SITE-KEY');
  const lsSiteHost = localStorage.getItem('X-SITE-HOST');

  if (lsSiteId && config.headers) config.headers['X-SITE-ID'] = lsSiteId;
  if (lsSiteKey && config.headers) config.headers['X-SITE-KEY'] = lsSiteKey;
  if (lsSiteHost && config.headers) config.headers['X-SITE-HOST'] = lsSiteHost;
  ```

### Step 6: Backend Tenant Data Isolation
- Route handlers (such as `/api/orders`, `/api/users`, `/api/customers`) extract `X-SITE-ID` or search parameter `site`.
- Enforces strict tenant partitioning:
  - Users belonging to Site A cannot view Orders belonging to Site B unless authorized with `super_admin` permissions (`scope=all`).

---

## 3. Verified File Map

| Component / Function | File Path | Line Range | Architectural Responsibility |
| :--- | :--- | :---: | :--- |
| **initializeSite / fetchSiteInfo** | `src/store/site/siteActions.ts` | L1-59 | Domain detection, API fetch & header storage |
| **useSiteStore** | `src/store/site/siteStore.ts` | L15-41 | Persistent Zustand store for site metadata |
| **get-info-by-domain API** | `src/app/api/sites/get-info-by-domain/route.ts` | L4-58 | Resolves host domain to tenant credentials |
| **Interceptor Injection** | `src/lib/api/interceptors.ts` | L26-33 | Automatic injection of `X-SITE-*` headers |
| **Branding Helper** | `src/utils/branding.ts` | L1-30 | Dynamic favicon & title injection |
