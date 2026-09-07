# Auth Middleware & API Security Guide

## Source
- Route auth proxy / middleware: `src/proxy.ts` (Next.js 16 proxy convention, migrated from `middleware.ts`)
- API route authentication helper: `src/lib/auth/apiAuth.ts`
- Cryptographic JWT engine: `src/lib/auth/jwt.ts` (Web Crypto HMAC SHA-256)

## Protected Page Prefixes
- /dashboard
- /super-dashboard
- /sites
- /orders
- /customers
- /leads
- /prescriptions
- /users
- /surveys
- /activity-logs
- /queue-monitor
- /docman-jobs
- /account

## Public Prefixes
- /login
- /register
- /favicon.ico
- /s
- /api/auth/login
- /api/auth/logout

## Rules & Security Standards
- Any newly protected page prefix must be added to `protectedRoutes` in `src/proxyRoutes.ts`.
- Token checks on SSR navigation happen via `httpOnly: true` cookie `token` on server-side proxy (`src/proxy.ts`).
- `superAdminOnlyRoutes` (`/super-dashboard`, `/sites`, `/users`) strictly block non-super-admin roles.
- Root route redirects to `/super-dashboard` (super admin) or `/dashboard` (other roles), or `/login` if no token.
- Role-aware dashboard redirects are enforced:
	- super_admin on /dashboard -> /super-dashboard
	- non-super-admin on /super-dashboard -> /dashboard
- Post-login redirection supports `returnUrl` from query parameters (`/login?returnUrl=...`) validated against role permissions.
- Protected API routes must use `verifyApiAuth(request, { requiredRoles })` to validate the cryptographic JWT signature and expiration.
- In-session token expiry during XHR is handled by `src/lib/api/interceptors.ts` 401 logic for immediate client-side logout redirect.
