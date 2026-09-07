# API Client Guide

## Source of Truth
- Shared client: src/api/apiClient.ts

## Responsibilities
- Adds Authorization header from token cookie/localStorage.
- Adds X-SITE-ID, X-SITE-KEY, X-SITE-HOST from localStorage.
- Starts/stops global loader through useGlobalLoader store.
- Unwraps standard backend envelopes ({ status, data } and { success, data }).
- Emits targeted `[VIDEO_DEBUG]` logs for `/video/*` requests/responses/errors when debug mode is enabled.
- Handles global 401 behavior by clearing auth state and triggering immediate client logout redirect for protected-page contexts.

## Rules
- All app API calls must use apiClient.
- Service files should not duplicate interceptor logic.
- Public endpoints can bypass token handling when intentionally configured.
- Video debug logs are gated: enabled in dev, or in other environments only if `localStorage.DEBUG_VIDEO_RECORDINGS = 'true'`.
- Do not force global 401 redirect for auth page/auth endpoint failures (`/login`, `/register`, `/auth/login`, `/auth/signup`) to preserve login error handling UX.

## Change Checklist
- If request/response envelope handling changes, update this file and GOTCHAS.md.
- If site header behavior changes, verify localStorage key names are still consistent.
