# Frontend Env Variables Guide

## Purpose
- Provide one consistent pattern for reading frontend env flags safely in Astro + Vite bundles.
- Avoid production bugs where env vars exist in Heroku config but are not surfaced in client code due to unsafe access patterns.

## Standard Utility
- Use `src/utils/env.ts` for all env parsing and localStorage debug toggles.
- Prefer these helpers:
	- `getFirstDefinedEnvValue(...)`
	- `isEnvFlagEnabled(...)`
	- `isLocalStorageDebugFlagEnabled(key)`

## Instruction Set (Rules)
1. Always read env keys with direct `import.meta.env.KEY` access at call site and pass values into utility helpers.
2. Do not rely on a dynamic env map like `const env = import.meta.env; env[someKey]` for build-critical flags.
3. For client-exposed flags in Astro apps, include `PUBLIC_*` fallback keys where appropriate.
4. Normalize boolean-like flags through utility helpers; accepted truthy values are `true`, `1`, `yes`, `on`.
5. For debug logs, gate behind `isLocalStorageDebugFlagEnabled('DEBUG_*')` so production logging stays opt-in.

## Recommended Key Precedence
- For feature flags that may come from different deployment setups:
	- `VITE_*` -> `PUBLIC_*` -> legacy fallback key

Example:
```ts
const autoResyncEnv = getFirstDefinedEnvValue(
  import.meta.env.VITE_AUTO_RESYNC,
  import.meta.env.PUBLIC_AUTO_RESYNC,
  import.meta.env.AUTO_RESYNC,
);
const isAutoResyncEnabled = isEnvFlagEnabled(autoResyncEnv);
```

## Troubleshooting Checklist
1. Confirm app config vars are set on the correct deployment app.
2. Confirm frontend was rebuilt after env changes.
3. Confirm logs show resolved env value in client code.
4. If env appears undefined in bundle, verify direct `import.meta.env.KEY` usage.

## Apr 28 2026 Incident - Auto Resync Flag Looked Missing
- Symptom: `[AUTO_RESYNC_DEBUG]` logged `autoResyncEnv: undefined` and `shouldAutoResync: false`.
- Root cause: config vars were first changed on staging app A, while testing happened on `medipulse-frontend-staging` (`staging.medipulse.co.uk`).
- Important detail: `medipulse-frontend-staging` had `VITE_AUTO_RESYNC=true` but was missing `PUBLIC_AUTO_RESYNC` until explicitly added.

### Fast Verification Commands
```bash
heroku apps | findstr /I "medipulse frontend staging"
heroku domains --app medipulse-frontend-staging
heroku config --app medipulse-frontend-staging | findstr /I "AUTO_RESYNC"
heroku releases --app medipulse-frontend-staging -n 10 --json
```

### Never Rules
1. Never set a frontend flag before confirming the exact target app and domain pairing.
2. Never trust "var is set" without checking that same var on the app currently serving the tested domain.
3. Prefer `PUBLIC_AUTO_RESYNC` as the canonical flag for client behavior; keep `VITE_AUTO_RESYNC` only as compatibility fallback.

## Quick Links
- Utility: `src/utils/env.ts`
- Utility tests: `src/utils/env.test.ts`
- Current usage examples:
	- `src/components/order-details/sections/OrderDetailsMainContent.tsx`
	- `src/components/order-details/hooks/useResyncFromShopify.ts`
	- `src/components/order-details/hooks/useVideoRecordings.ts`
	- `src/api/apiClient.ts`
