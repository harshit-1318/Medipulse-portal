# Authentication & Session Security — MediPulse Portal

## 1. Token Storage & Propagation
- JWT authentication token is stored in **HTTP-only style cookies** (`token`) with 7-day expiration and fallback to `localStorage.accessToken`.
- `apiClient` automatically attaches `Authorization: Bearer <token>` to all authenticated requests.
- Cookie removal and localStorage clearance happen centrally in `userStore.actions.logout()`.

---

## 2. Next.js Edge Middleware Protection (`src/middleware.ts`)
- Edge Middleware runs on every route request before page execution.
- Checks cookie `token` and `role`.
- Redirects unauthenticated users attempting to access protected routes to `/login`, preserving `?returnUrl=<pathname+search>`.
- Redirects authenticated users from `/login` to `/super-dashboard` (`super_admin`) or `/dashboard` (all other roles).

---

## 3. Idle Session Timeout Manager (`IdleSessionManager.tsx`)
- Monitored activities: `mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart`.
- **Warning Threshold:** 15 minutes of continuous inactivity displays a warning popup with a 60-second countdown.
- **Hidden-Tab Protection:** If inactivity threshold occurs while tab is hidden (`document.hidden`), warning display is deferred until tab becomes visible. Warning countdown pauses while hidden, preventing silent instant logouts upon tab return.
- **Logout Action:** Expiration triggers `userStore.actions.logout()`.

---

## 4. Post-Logout Return URL Restoration (`authRedirect.ts`)
- Idle auto-logout or 401 token expiry saves current pathname and query params to `sessionStorage`.
- Successful re-login restores saved URL, allowing clinicians to resume exact order or patient views without losing context.
