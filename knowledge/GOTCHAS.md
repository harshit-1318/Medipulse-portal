# Frontend Gotchas

## API and Headers
- Never use raw axios for app data calls. Use src/api/apiClient.ts to ensure auth and site headers are attached.
- Do not manually add X-SITE-ID, X-SITE-KEY, X-SITE-HOST in service methods. The interceptor owns this.

## Sorting and Filtering
- Always normalize sort direction through normalizeSortOrder().
- Keep UI-to-backend sort field mapping inside service param builders, not UI components.

## SSR vs Browser Runtime
- Avoid direct window/localStorage access in SSR paths without guard checks.
- Astro pages should do initial fetch server-side and pass initialData into React islands.
- Do not wrap route/page components with additional `QueryProvider` instances when the layout already provides one. Nested providers can show a second full-screen `Initializing...` overlay and make pages appear stuck.

## Auth Protection
- New protected pages must be reflected in src/middleware.ts protectedRoutes.
- Missing token redirects happen server-side for protected route prefixes.

## Testing
- New API service methods need success + error/empty tests.
- New hooks need success + edge-case tests.

## Env Variables (Astro + Vite)
- For client feature flags, avoid dynamic env access patterns that can bypass build-time replacement.
- Use direct key reads (`import.meta.env.VITE_*`, `import.meta.env.PUBLIC_*`) and pass the values into `src/utils/env.ts` helpers.
- Standard helpers:
	- `getFirstDefinedEnvValue(...)`
	- `isEnvFlagEnabled(...)`
	- `isLocalStorageDebugFlagEnabled(...)`
- Auto re-sync production gotcha (Apr 28 2026): if debug logs show `autoResyncEnv: undefined`, first verify the tested domain is mapped to the same Heroku app where vars were set. We initially set vars on staging app A while testing `staging.medipulse.co.uk`, which is served by `medipulse-frontend-staging`.
- For order-details auto resync, treat `PUBLIC_AUTO_RESYNC` as required on the active frontend app; keep `VITE_AUTO_RESYNC` as fallback only.

## Order Details BMI
- Ethnicity-based BMI thresholds depend on consultation answer text matching. Normalize punctuation/casing when matching option labels and add tests for every supported website option to avoid silent misclassification.
