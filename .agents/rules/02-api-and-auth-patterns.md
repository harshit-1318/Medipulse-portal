# 02. API Client, Authentication & Multi-Site Patterns

## 🔐 Authentication & Site Headers

### Auth token
- Stored in **cookie** (`token`) — read by Next.js edge middleware
- Also stored in **localStorage** (`accessToken`) — fallback for client XHR
- Set/cleared via `useUserStore` (`src/store/userStore.ts`)

### Site identification
The frontend mirrors the backend's multi-site system. Every API request MUST include site headers:

```typescript
// Set once on app load (siteStore.ts)
localStorage.setItem('X-SITE-ID', siteInfo.id);
localStorage.setItem('X-SITE-KEY', siteInfo.key);
localStorage.setItem('X-SITE-HOST', currentDomain);

// Injected automatically by apiClient.ts interceptor on every request
config.headers['X-SITE-ID'] = lsSiteId;
config.headers['X-SITE-KEY'] = lsSiteKey;
config.headers['X-SITE-HOST'] = lsSiteHost;
```

**Never** manually add site headers to individual API calls — the interceptor handles it.

### Auth proxy / middleware (`src/proxy.ts`)
Protects server-side routes (Next.js 16 `proxy.ts` convention). If adding a new protected page, ensure its path prefix is in the `protectedRoutes` array:
```typescript
const protectedRoutes = ['/dashboard', '/super-dashboard', '/prescriptions', '/users', '/surveys', '/leads'];
```

---

## 🌐 API Client Pattern

**File**: `src/lib/api/client.ts` or `src/api/apiClient.ts`

All API calls go through the shared axios instance. It automatically:
- Attaches `Authorization: Bearer <token>`
- Attaches site headers (`X-SITE-ID`, `X-SITE-KEY`, `X-SITE-HOST`)
- Starts/stops the global loading indicator
- Unwraps `{ status, data }` response envelopes

### ❌ WRONG — direct axios
```typescript
const res = await axios.get('/orders/search', { headers: { 'X-SITE-ID': siteId } });
```

### ✅ RIGHT — use apiClient
```typescript
import apiClient from '@/api/apiClient';
const res = await apiClient.get({ url: '/orders/search', params: { page: 1 } });
```

### API service structure
Each domain has a dedicated service file or folder:
```
src/api/services/
  orders/
    buildParams.ts     ← param builder (pure function, testable)
    orderService.ts    ← API calls
  customer/
    index.ts           ← API calls
    utils.ts           ← normalizeCustomer(), buildCustomerParams()
  surveyService.ts
  userService.ts
  siteService.ts
```
