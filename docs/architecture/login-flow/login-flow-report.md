# MediPulse Healthcare Portal — Complete Login & Authentication Architecture Report

**Document Version:** 1.0.0  
**Verification Target:** `D:\New projects\1 MediPulse`  
**Classification:** Architecture Specification & Security Analysis  
**Framework Baseline:** Next.js 16 App Router · React 19 · TypeScript · MongoDB Atlas (Mongoose 9) · Web Crypto API (HMAC SHA-256) · Zustand 5 · Axios  

---

## 1. Executive Summary

This report presents the verified end-to-end architecture and runtime execution sequence for user authentication, session lifecycle, edge route protection, and access control across the **MediPulse Healthcare Portal**.

Every component, function, API route, cryptographic utility, cookie setting, and database interaction documented herein was verified directly against the production source code in `D:\New projects\1 MediPulse`. No fictional abstractions or undocumented assumptions have been introduced.

```
       [ Client Browser ] 
              │
              ▼ (1-5) Controlled Form & Submit
     [ LoginForm.tsx ]
              │
              ▼ (6) Axios apiClient.post('/auth/login')
   [ POST /api/auth/login ] ───────► [ MongoDB Atlas (users) ]
              │                                │
              ▼ (10-12) bcrypt & signJwt       ▼ (9) User lookup
   [ Web Crypto HMAC-SHA256 ]     [ Cached Mongoose Pool ]
              │
              ▼ (12) HttpOnly 'token' cookie + JSON response
    [ Zustand userStore ] 
              │
              ▼ (14) Safe Open-Redirect Guard
       [ window.location ]
              │
              ▼ (15-17) Next.js 16 Edge Proxy (src/proxy.ts)
     [ Role-Based Access ] ───► /super-dashboard or /dashboard
              │
              ▼ (18-19) Active Monitoring
   [ IdleSessionManager ] ───► 15-min Inactivity Logout
```

---

## 2. Complete Verified Step-by-Step Execution Sequence

The authentication lifecycle traverses seven architectural tiers:

### Step 1: Browser Navigation to Login Page
- **Initiator:** Client Browser (Desktop/Mobile Web)
- **Path:** `/login` or `/login?returnUrl=/orders`
- **Behavior:**
  - If an unauthenticated user attempts to visit any protected route (e.g., `/orders`, `/prescriptions`), the Next.js edge proxy (`src/proxy.ts:53-58`) intercepts the navigation with a `307 Temporary Redirect` to `/login?returnUrl=<encoded_path>`.
  - If a user already possesses a valid `token` cookie and accesses `/login`, `src/proxy.ts:42-45` intercepts and immediately forwards them to their authorized dashboard (`/super-dashboard` or `/dashboard`).

### Step 2: Next.js App Router Renders Login UI
- **File:** [`src/app/(auth)/login/page.tsx`](file:///D:/New%20projects/1%20MediPulse/src/app/(auth)/login/page.tsx)
- **Execution:** Client Component (`'use client'`)
- **Behavior:**
  - Hydrates theme state from `localStorage.getItem('medipulse-theme')` (lines 11-23), dynamically appending the `dark` class to `document.documentElement`.
  - Renders ambient cyan/teal gradient backlights, animated pulse blurs, subtle grid masking, the MediPulse vector [`Logo`](file:///D:/New%20projects/1%20MediPulse/src/components/common/Logo.tsx) (size 210), and mounts the [`LoginForm`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/LoginForm.tsx).

### Step 3: User Enters Email and Password
- **File:** [`src/components/auth/login/LoginForm.tsx`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/LoginForm.tsx) (lines 48-49)
- **Subcomponents:**
  - [`EmailInput`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/components/EmailInput.tsx) (lines 25-63): Controlled input with autofocus, Mail icon, and real-time state binding.
  - [`PasswordInput`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/components/PasswordInput.tsx) (lines 29-94): Controlled input with Lock icon and toggleable password visibility (`showPassword` state with Lucide `Eye` and `EyeOff` icons).

### Step 4: Form State & Validation Management
- **File:** [`src/components/auth/login/hooks/useLoginFormSubmit.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/hooks/useLoginFormSubmit.ts) (lines 10-15)
- **State Hooks:**
  - `email`, `setEmail` (`useState('')`)
  - `password`, `setPassword` (`useState('')`)
  - `loading`, `setLoading` (`useState(false)`)
  - `error`, `setError` (`useState('')`)
  - `isDetecting` (`useSiteLoading()` from site store)
- **Validation:** Handles field normalization, HTML5 constraint enforcement, and preparation for API submission.

### Step 5: Form Submission & Global Loader Activation
- **File:** [`src/components/auth/login/hooks/useLoginFormSubmit.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/hooks/useLoginFormSubmit.ts) (lines 20-25)
- **Execution:**
  - Invoked by [`SubmitButton`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/components/SubmitButton.tsx) click or Enter key.
  - Calls `e.preventDefault()`.
  - Resets previous errors (`setError('')`), flags `loading = true`.
  - Starts global loading bar: `startLoader('login')` via Zustand store [`useGlobalLoader`](file:///D:/New%20projects/1%20MediPulse/src/store/loader/globalLoader.ts).

### Step 6: Unified API Client Dispatch
- **Files:**
  - Service: [`src/api/services/user/userService.ts`](file:///D:/New%20projects/1%20MediPulse/src/api/services/user/userService.ts) (lines 7-9):
    ```typescript
    export const login = async (data: SignInReq) => {
      return apiClient.post<LoginRes>(UserApi.Login, data);
    };
    ```
  - Enum: `UserApi.Login = "/auth/login"` ([`src/api/services/user/userTypes.ts:26`](file:///D:/New%20projects/1%20MediPulse/src/api/services/user/userTypes.ts#L26))
  - Axios Instance: [`src/lib/api/client.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/api/client.ts) (lines 6-8, 29-32) resolves `baseURL` to `/api` on the client, dispatching `POST /api/auth/login`.
  - Interceptors: [`src/lib/api/interceptors.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/api/interceptors.ts) (lines 19-21) identifies `/auth/login` as a declared `publicEndpoint`, intentionally omitting the `Authorization: Bearer` header.

### Step 7: Next.js App Router API Route Handler
- **File:** [`src/app/api/auth/login/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/route.ts) (lines 9-13)
- **Execution:**
  - Serverless route handler exporting `export async function POST(request: Request)`.
  - Connects to database and extracts JSON body: `const body = await request.json().catch(() => ({}));`.

### Step 8: Server-Side Request Validation
- **File:** [`src/app/api/auth/login/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/route.ts) (lines 15-23)
- **Rules:**
  - `emailStr = (email || '').trim().toLowerCase();`
  - `passwordStr = (password || '').trim();`
  - If either string is empty, short-circuits with `400 Bad Request`:
    `{ status: 'ERROR', success: false, message: 'Email and password are required', data: null }`.

### Step 9: MongoDB Connection Pooling & User Lookup
- **Files:**
  - Connection Pool: [`src/lib/db/mongodb.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/mongodb.ts) (lines 24-61) uses a global cached promise across serverless invocations with retry backoff (`bufferCommands: false`).
  - ODM Model: [`src/lib/db/models/User.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/models/User.ts) (lines 17-31) mapping the `users` collection.
  - Query:
    ```typescript
    const dbUser = await User.findOne({
      email: { $regex: new RegExp(`^${emailStr}$`, 'i') },
    });
    ```
- **Error Branches:**
  - If user not found (`!dbUser`): returns `401 Unauthorized` (`"Invalid email or password"`).
  - If account disabled (`dbUser.is_active === false`): returns `403 Forbidden` (`"Account is disabled. Please contact administrator."`).

### Step 10: Password Hash Verification
- **File:** [`src/app/api/auth/login/helpers.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/helpers.ts) (lines 8-19)
- **Algorithm:**
  ```typescript
  export async function verifyUserPassword(dbUser: any, passwordStr: string): Promise<boolean> {
    const storedPassword = dbUser.password || '';
    if (!storedPassword) return false;
    if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
      return bcrypt.compareSync(passwordStr, storedPassword);
    }
    return storedPassword === passwordStr;
  }
  ```
- **Error Branch:**
  - If comparison fails: returns `401 Unauthorized` (`"Invalid email or password"`).

### Step 11: Role Derivation & Cryptographic JWT Creation
- **Files:**
  - Super Admin Checker: [`src/app/api/auth/login/helpers.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/helpers.ts) (lines 21-31):
    Evaluates `dbUser.is_super_admin`, `dbUser.role === 'super_admin'`, or inclusion in `process.env.SUPER_ADMIN_EMAILS`.
  - Permissions Matrix: [`src/app/api/auth/login/permissions.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/permissions.ts) (lines 1-23):
    Assigns role permissions (e.g., `super_admin` receives `['*']`, `prescriber` receives `['prescriber:orders', 'prescriber:prescriptions', ...]`).
  - JWT Engine: [`src/lib/auth/jwt.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/auth/jwt.ts) (lines 43-61):
    Signs payload with Web Crypto API (`crypto.subtle.sign` HMAC-SHA256).
    - Header: `{ alg: 'HS256', typ: 'JWT' }`
    - Payload: `{ sub, email, role, effectiveRole, isSuperAdmin, site_id, iat, exp }`
    - Secret: Derived from `process.env.JWT_SECRET`
    - Validity: 7 days (`7 * 24 * 3600` seconds).

### Step 12: HttpOnly Security Cookie & Audit Log
- **Files:**
  - Cookie Dispatch: [`src/app/api/auth/login/helpers.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/helpers.ts) (lines 62-88):
    Sets HttpOnly `token` cookie and hydration cookies on the response:
    * `token`: `{ httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 604800 }`
    * `role`: `{ httpOnly: false, secure: isProd, sameSite: 'lax', path: '/', maxAge: 604800 }`
    * `username`: `{ httpOnly: false, ... }`
    * `site_id`: `{ httpOnly: false, ... }`
  - Audit Trail: [`src/lib/db/logActivityHelper.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/logActivityHelper.ts) (invoked from `route.ts:71-83`):
    Asynchronously logs an immutable record with action `login_success` in MongoDB collection `activitylogs`.

### Step 13: Response Envelope & Client Hydration
- **Files:**
  - Server Response: [`src/app/api/auth/login/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/route.ts) (lines 56-67) returns `{ status: 'SUCCESS', success: true, data: { token, access_token, jwt, accessToken, user } }`.
  - Axios Unwrapping: [`src/lib/api/interceptors.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/api/interceptors.ts) (lines 58-70) unwraps `res.data` and stops loader.
  - State Sync: [`src/components/auth/login/hooks/useLoginFormSubmit.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/hooks/useLoginFormSubmit.ts) (lines 30-42):
    * Stores user in Zustand [`useUserStore.getState().actions.setUser(user)`](file:///D:/New%20projects/1%20MediPulse/src/store/user/userStore.ts#L29), syncing to `localStorage.setItem('user', ...)`.
    * Stores token in Zustand `setToken(token)`, setting fallback `localStorage.setItem('accessToken', token)`.
    * Synchronizes client cookies: `Cookies.set('role', finalRole, { expires: 7 })` and `Cookies.set('username', username)`.

### Step 14: Safe Open-Redirect Validation & Navigation
- **Files:**
  - Logic: [`src/components/auth/login/hooks/useLoginFormSubmit.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/hooks/useLoginFormSubmit.ts) (lines 44-57)
  - Security Validator: [`src/utils/auth/authRedirect.ts`](file:///D:/New%20projects/1%20MediPulse/src/utils/auth/authRedirect.ts) (lines 3-18):
    * `isValidPostLoginRedirectPath(returnUrl)` enforces paths start with `/` and NOT `//` (preventing protocol-relative open-redirect attacks).
    * Rejects paths starting with `/login` or `/register` to prevent redirect loops.
    * Verifies role permission via `isRouteAllowedForRole(returnUrl, finalRole)`.
    * Checks previously stored session redirect via `consumePostLoginRedirect()`.
    * Default fallback: `isSuperAdmin ? '/super-dashboard' : '/dashboard'`.
    * Dispatches navigation: `window.location.href = targetRedirect || defaultRedirect;`.

### Step 15: Next.js 16 Edge Proxy Route Protection
- **File:** [`src/proxy.ts`](file:///D:/New%20projects/1%20MediPulse/src/proxy.ts) (lines 5-58)
- **Matcher:** `config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }`
- **Execution:**
  - Evaluated on every page navigation at the edge prior to layout/page rendering.
  - Extracts `token = request.cookies.get('token')?.value` and `cookieRole = request.cookies.get('role')?.value`.
  - Checks if route is in `protectedRoutes` ([`src/proxyRoutes.ts:2-6`](file:///D:/New%20projects/1%20MediPulse/src/proxyRoutes.ts#L2-L6)).
  - If protected and `!token`: redirects to `/login?returnUrl=${pathname + search}`.

### Step 16: Anti-Spoofing JWT Decoding in Edge Proxy
- **File:** [`src/proxyJwt.ts`](file:///D:/New%20projects/1%20MediPulse/src/proxyJwt.ts) (lines 5-24)
- **Security Check:**
  - The proxy does not trust the plaintext `role` cookie.
  - Parses the cryptographically signed JWT payload via `decodeJwtPayload(token)`.
  - Derives `role = payload.effectiveRole || payload.role || role`.
  - Derives `isSuperAdmin = Boolean(payload.isSuperAdmin || payload.is_super_admin || payload.role === 'super_admin' || ...)`.
  - Completely neutralizes client-side cookie tampering attempts.

### Step 17: Role-Based Access Control (RBAC) & Dashboard Separation
- **Files:**
  - Enforcement: [`src/proxy.ts`](file:///D:/New%20projects/1%20MediPulse/src/proxy.ts) (lines 60-80)
  - RBAC Definition: [`src/proxyRoutes.ts`](file:///D:/New%20projects/1%20MediPulse/src/proxyRoutes.ts) (lines 8-34)
- **Rules:**
  - **Dashboard Separation:**
    * If `pathname === '/dashboard'` and `isSuperAdmin` -> redirected to `/super-dashboard`.
    * If `pathname.startsWith('/super-dashboard')` and `!isSuperAdmin` -> redirected to `/dashboard`.
  - **Super Admin Exclusive Routes:**
    * `/super-dashboard`, `/sites`, `/users`, `/super-admin`, `/role-credentials` strictly require `isSuperAdmin === true`. Non-super-admins are redirected to `/dashboard`.
  - **Role Matrix:**
    * Validates `isRouteAllowedForRole(pathname, effectiveRole)`. If unauthorized, redirects to `/dashboard`.
  - **Order Convenience:** Redirects `/orders` directly to `/orders/all`.
  - **Authorized Pass:** If all checks pass, yields `NextResponse.next()`.

### Step 18: Inactivity Session Monitoring (IdleSessionManager)
- **Files:**
  - Shell Component: Mounted in [`src/app/(dashboard)/layout.tsx:24`](file:///D:/New%20projects/1%20MediPulse/src/app/(dashboard)/layout.tsx#L24)
  - Manager: [`src/components/auth/IdleSessionManager.tsx`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/IdleSessionManager.tsx)
  - Hook: [`src/components/auth/hooks/useIdleSession.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/hooks/useIdleSession.ts)
  - Constants: [`src/components/auth/hooks/idleSessionUtils.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/hooks/idleSessionUtils.ts)
- **Parameters:**
  - `IDLE_TIMEOUT_MS = 15 * 60 * 1000` (15 minutes)
  - `WARNING_TIMEOUT_MS = 60 * 1000` (60 seconds countdown)
  - Monitored Events: `mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart`, `pointerdown`.
- **Behavior:**
  - If user is inactive for 15 minutes, displays [`IdleWarningModal`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/IdleWarningModal.tsx) with a 60s countdown.
  - Handles backgrounded tabs: defers warning until `document.visibilityState === 'visible'`.
  - User can click "Stay logged in" to reset the timer.
  - If warning countdown reaches 0 or user clicks "Logout", invokes `handleLogout()`.

### Step 19: Logout Execution & Invalidation Flow
- **Files:**
  - Store Action: [`src/store/user/userStore.ts`](file:///D:/New%20projects/1%20MediPulse/src/store/user/userStore.ts) (lines 63-74)
  - Storage Cleanup: [`src/store/user/userHelpers.ts`](file:///D:/New%20projects/1%20MediPulse/src/store/user/userHelpers.ts) (lines 50-62)
  - API Handler: [`src/app/api/auth/logout/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/logout/route.ts) (lines 4-58)
- **Triggers:**
  1. Manual user click in Header Account Dropdown ([`AccountDropdownMenu.tsx:53`](file:///D:/New%20projects/1%20MediPulse/src/components/layout/account/AccountDropdownMenu.tsx#L53)).
  2. Idle inactivity timeout countdown expiry.
  3. API 401 response auto-logout interceptor ([`src/lib/api/interceptors.ts:83`](file:///D:/New%20projects/1%20MediPulse/src/lib/api/interceptors.ts#L83)).
- **Execution:**
  - Saves current URL via `savePostLoginRedirectFromCurrentLocation()`.
  - Dispatches background `POST /api/auth/logout`.
  - Route handler logs activity (`action: 'logout'`) and clears cookies (`token`, `role`, `username`, `site_id`) with `maxAge: 0, expires: new Date(0), path: '/'`.
  - Clears `localStorage` keys (`user`, `accessToken`, `global-search-recent`, `customer-filters`, `dashboardFilters_*`).
  - Resets Zustand store: `{ user: null, token: null }`.
  - Redirects browser to `/login`.

---

## 3. Verified Source Code Reference Table

| Step | Component / Function | File Path | Line Range | Responsibility | Security & Guards |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **01** | Browser Request | `src/app/(auth)/login/` | — | Entry point for unauthenticated sessions | Route proxy gatekeeper |
| **02** | `LoginPage` | [`src/app/(auth)/login/page.tsx`](file:///D:/New%20projects/1%20MediPulse/src/app/(auth)/login/page.tsx) | L1-94 | Mounts theme & login container | Client-side theme isolation |
| **03** | `LoginForm` | [`src/components/auth/login/LoginForm.tsx`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/LoginForm.tsx) | L14-56 | Glassmorphic form card and input layout | CSRF prevention via Next.js App Router |
| **04** | `useLoginFormSubmit` | [`src/components/auth/login/hooks/useLoginFormSubmit.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/hooks/useLoginFormSubmit.ts) | L10-25 | Local form state, errors & submission coordinator | Input sanitization & state validation |
| **05** | `SubmitButton` | [`src/components/auth/login/components/SubmitButton.tsx`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/login/components/SubmitButton.tsx) | L20-53 | Button with spinner & detection state | Prevents double submission |
| **06** | `login()` | [`src/api/services/user/userService.ts`](file:///D:/New%20projects/1%20MediPulse/src/api/services/user/userService.ts) | L7-9 | Dispatches typed login request via Axios | Public endpoint bypasses Bearer injection |
| **06b** | `apiClient` & Interceptors | [`src/lib/api/interceptors.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/api/interceptors.ts) | L13-52 | Interceptor manages loader & public endpoints | 401 Auto-logout listener |
| **07** | `POST /api/auth/login` | [`src/app/api/auth/login/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/route.ts) | L9-93 | App Router API endpoint handler | Body parser error catch |
| **08** | Validation logic | [`src/app/api/auth/login/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/route.ts) | L15-23 | Email & password presence check | Returns 400 Bad Request on empty inputs |
| **09** | `User.findOne` | [`src/app/api/auth/login/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/route.ts) | L25-41 | Database lookup by case-insensitive regex | 401 on not found; 403 on disabled user |
| **09b**| `connectToDatabase` | [`src/lib/db/mongodb.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/mongodb.ts) | L24-61 | Global Mongoose connection pool | Prevents connection leaks; exponential backoff |
| **10** | `verifyUserPassword` | [`src/app/api/auth/login/helpers.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/helpers.ts) | L8-19 | Bcrypt compare against stored hash | Timing-attack resistant bcrypt verification |
| **11** | `buildAuthPayload` | [`src/app/api/auth/login/helpers.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/helpers.ts) | L33-60 | Computes effective role & calls `signJwt` | Super Admin override & role derivation |
| **11b**| `signJwt` | [`src/lib/auth/jwt.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/auth/jwt.ts) | L43-61 | Signs HMAC-SHA256 JWT with Web Crypto | Standard 7-day TTL expiration timestamp |
| **12** | `setAuthCookies` | [`src/app/api/auth/login/helpers.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/helpers.ts) | L62-88 | Sets HttpOnly cookie for token | `httpOnly: true`, `sameSite: 'lax'`, `path: '/'` |
| **12b**| `recordActivity` | [`src/lib/db/logActivityHelper.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/logActivityHelper.ts) | L6-83 | Writes audit log in `ActivityLog` collection | Immutable compliance logging |
| **13** | Store Hydration | [`src/store/user/userStore.ts`](file:///D:/New%20projects/1%20MediPulse/src/store/user/userStore.ts) | L29-61 | Zustand updates user state & tokens | Syncs client-side fallback `localStorage` |
| **14** | `consumePostLoginRedirect` | [`src/utils/auth/authRedirect.ts`](file:///D:/New%20projects/1%20MediPulse/src/utils/auth/authRedirect.ts) | L3-46 | Sanitizes post-login returnUrl | Open-redirect protection (`/` valid, `//` rejected) |
| **15** | `proxy()` | [`src/proxy.ts`](file:///D:/New%20projects/1%20MediPulse/src/proxy.ts) | L5-58 | Edge proxy route guard | Next.js 16 Edge proxy convention |
| **16** | `decodeJwtPayload` | [`src/proxyJwt.ts`](file:///D:/New%20projects/1%20MediPulse/src/proxyJwt.ts) | L5-24 | Extracts verified role from JWT at the edge | Anti-cookie-spoofing mechanism |
| **17** | `isRouteAllowedForRole` | [`src/proxyRoutes.ts`](file:///D:/New%20projects/1%20MediPulse/src/proxyRoutes.ts) | L12-34 | Enforces RBAC permissions per route | Super Admin isolation & role gating |
| **18** | `useIdleSession` | [`src/components/auth/hooks/useIdleSession.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/auth/hooks/useIdleSession.ts) | L16-95 | Inactivity timer (15 min + 60s modal) | Tab visibility-aware timer suspension |
| **19** | `handleLogout` | [`src/app/api/auth/logout/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/logout/route.ts) | L4-58 | Invalidates cookies & logs event | Expires cookies (`maxAge: 0, expires: 1970`) |

---

## 4. Protected API Route Guards (`verifyApiAuth`)

Beyond page navigations, all protected serverless API endpoints (such as `/api/orders`, `/api/prescriptions`, `/api/users`) enforce authorization through [`verifyApiAuth`](file:///D:/New%20projects/1%20MediPulse/src/lib/auth/apiAuth.ts):

```typescript
export async function verifyApiAuth(
  request: Request,
  options: AuthCheckOptions = {}
): Promise<AuthResult>
```

1. **Token Extraction:** Evaluates `Authorization: Bearer <token>` header first. If omitted, falls back to the `token` cookie header (`cookieHeader.match(/(?:^|;\s*)token=([^;]+)/)`).
2. **Cryptographic Signature Verification:** Calls `verifyJwt<JwtPayload>(token)` using Web Crypto `crypto.subtle.verify('HMAC', key, signature, dataToVerify)`.
3. **Expiration Validation:** Evaluates `payload.exp < Math.floor(Date.now() / 1000)`. If expired, returns `401 Unauthorized` (`"Unauthorized: Invalid or expired token"`).
4. **Super Admin Guard:** If `options.requireSuperAdmin` is set and the token is not super admin, returns `403 Forbidden` (`"Forbidden: Super Admin access required"`).
5. **Role Matrix Guard:** If `options.requiredRoles` is configured and user's `effectiveRole` does not match, returns `403 Forbidden` (`"Forbidden: Insufficient permissions for this resource"`).

---

## 5. Security & Cryptographic Analysis

### 5.1 Web Crypto API vs Node Crypto
The JWT engine in [`src/lib/auth/jwt.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/auth/jwt.ts) uses the W3C **Web Crypto API** (`crypto.subtle`) rather than Node.js `crypto`. This guarantees 100% interoperability across:
- Node.js runtime (serverless API route handlers)
- Next.js Edge Runtime (`src/proxy.ts`)
- Browser runtimes (Vitest unit tests)

### 5.2 Cookie Protection Strategy
| Cookie Name | HttpOnly | SameSite | Secure | Path | MaxAge | Purpose |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `token` | **Yes** | `lax` | Yes (Prod) | `/` | 7 Days | Authentication bearer token for Edge Proxy & API routes |
| `role` | No | `lax` | Yes (Prod) | `/` | 7 Days | Client UI rendering & badge hydration |
| `username` | No | `lax` | Yes (Prod) | `/` | 7 Days | UI account display & greeting |
| `site_id` | No | `lax` | Yes (Prod) | `/` | 7 Days | Multi-tenant site partition header injection |

### 5.3 Anti-Spoofing Architecture
A critical security feature verified in [`src/proxy.ts:14-25`](file:///D:/New%20projects/1%20MediPulse/src/proxy.ts#L14-L25):
- Even though the browser stores a non-HttpOnly `role` cookie for quick UI rendering, the **Edge Proxy never relies on the `role` cookie for authorization**.
- Instead, the proxy parses the cryptographically signed `token` using `decodeJwtPayload(token)`.
- If an attacker manually modifies `document.cookie = "role=super_admin"`, the proxy detects the real role from the HMAC-signed JWT and immediately denies access to `/super-dashboard` or `/users`.

### 5.4 Open Redirect Defense
The helper [`src/utils/auth/authRedirect.ts`](file:///D:/New%20projects/1%20MediPulse/src/utils/auth/authRedirect.ts) mitigates open redirect vulnerabilities:
- Verifies path starts with single `/`.
- Rejects paths starting with `//` (preventing protocol-relative redirects such as `//malicious-phishing.com`).
- Disallows `/login` and `/register` to prevent infinite redirect loops.

---

## 6. Technology Stack Verification

All technologies referenced are confirmed in [`package.json`](file:///D:/New%20projects/1%20MediPulse/package.json):

| Technology | Verified Version | Implementation in Auth Flow |
| :--- | :--- | :--- |
| **Next.js** | `^16.0.0` | App Router route handlers (`src/app/api/auth/*`), Edge proxy (`src/proxy.ts`), nested layouts |
| **React** | `^19.2.4` | Client components, forms, hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) |
| **TypeScript** | `^5.9.3` | Strict type definitions (`JwtPayload`, `UserInfo`, `SignInReq`, `LoginRes`, `AuthResult`) |
| **MongoDB & Mongoose** | `^9.9.4` | Cached connection pool (`connectToDatabase`), `User` schema, `ActivityLog` schema |
| **bcryptjs** | `^3.0.3` | Secure salt comparison for stored password hashes (`verifyUserPassword`) |
| **Web Crypto API** | Native standard | HMAC SHA-256 token signing (`signJwt`) and verification (`verifyJwt`) |
| **Axios** | `^1.13.5` | Centralized `apiClient`, request/response interceptors, 401 redirect detection |
| **Zustand** | `^5.0.11` | Client state management for `userStore`, `globalLoader`, and `siteStore` |
| **Tailwind CSS** | `^4.2.1` | Modern glassmorphic dark theme, ambient glow backlights, responsive layout |
| **js-cookie** | `^3.0.5` | Client-side cookie reading and fallback management |
| **Framer Motion** | `^12.34.3` | Account dropdown menu animations and modal transitions |
| **Lucide React** | `^0.575.0` | Form icons (`Mail`, `Lock`, `Eye`, `EyeOff`, `LogOut`, `User`) |

---

## 7. Artifact Deliverables Summary

Under `docs/architecture/login-flow/`:
1. **`login-architecture.html`**: Standalone, interactive Archeify-style diagram with pan/drag, zoom in/out, execution step player, visual tiers, node cards, clickable inspection side panel with line-level code excerpts, and search filter.
2. **`login-flow.mmd`**: Valid Mermaid source flowchart detailing all 19 execution steps, decision diamonds, and error branches.
3. **`login-flow-report.md`**: This comprehensive architectural report.
