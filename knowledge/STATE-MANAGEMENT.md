# State Management Guide

## Stores
- src/store/siteStore.ts
- src/store/userStore.ts
- src/store/globalLoaderStore.ts

## Rules
- Do not create new global stores for per-component local state.
- Site headers are read from localStorage by interceptor; service methods should not inject them manually.
- Use user store for role-aware UI behavior and auth state transitions.

## Consistency Checklist
- Changing key names in localStorage requires updating both site store and apiClient behavior.
- If loader behavior changes, validate request/response interceptor lifecycle.
