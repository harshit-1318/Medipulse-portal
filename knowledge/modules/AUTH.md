# Module: Auth

## Scope
- Login/logout flows, session handling, and auth-based redirects.

## Main Locations
- Components: src/components/auth/
- Pages: src/pages/login.astro
- Middleware: src/middleware.ts
- Store: src/store/userStore.ts

## Notes
- Server-side protection depends on middleware route prefixes.
- Keep token handling consistent between cookie and localStorage fallback behavior.

## Recent Changes
- Login page branding now uses site settings (Apr 29 2026):
	- `src/components/common/Logo.tsx` reads `siteInfo.logo` and `siteInfo.name` from `siteStore`.
	- Falls back to static branding constants if site settings are missing.
	- This keeps `/login` aligned with per-site `Logo URL` configuration.

- Global idle timeout added for protected dashboard pages (Apr 29 2026):
	- Location: `src/components/auth/IdleSessionManager.tsx`
	- Mounted in: `src/layouts/DashboardLayout.astro` with `client:load`
	- Hidden-tab protection (May 1 2026 fix):
		- If idle timeout is reached while tab is hidden, warning is deferred until tab becomes visible.
		- Warning countdown is paused while tab is hidden and resumed only when visible.
		- Prevents "no warning shown, then instant logout on click" behavior.
	- Auto-logout return path behavior:
		- Idle auto-logout stores current in-app URL in session storage.
		- Login consumes saved URL and redirects user back to that page after successful auth.
		- Safety guard allows only internal app paths and rejects `/login`, `/register`, and external-like paths.
		- Utility: `src/utils/authRedirect.ts`.
	- Debug flag: set localStorage `DEBUG_IDLE_TIMER=true` to enable `[IDLE_DEBUG]` logs in production builds (DEV logs are enabled by default via `isLocalStorageDebugFlagEnabled`).
	- Fast debug overrides:
		- `DEBUG_IDLE_TIMEOUT_MS` (milliseconds)
		- `DEBUG_IDLE_WARNING_TIMEOUT_MS` (milliseconds)
	- Activity debug logs now include source event name (e.g. `mousemove`, `scroll`, `keydown`) with throttling.
	- Logic:
		- 15 minutes inactivity => warning popup
		- 1 additional minute inactivity => `actions.logout()`
		- Any activity while popup is shown resets timers and keeps the session alive
- Do not duplicate logout logic in timer code; always call `userStore.actions.logout()` so cookie/localStorage cleanup and redirect stay centralized.

- Login page Theme Toggle & Glassmorphism Redesign (Aug 27 2026):
	- Added `ThemeToggle.tsx` component with Sun/Moon toggle button at top-right of `/login`.
	- Toggles between Dark Mode (dark glassmorphism `bg-slate-900/85`, ambient glows, high contrast white text) and Light Mode (light glass card `bg-white/95`, clean border, slate-900 text).
	- State is stored in `localStorage` (`medipulse-theme`).
	- Removed white background square on default logo (`public/logo.png`) and added glowing drop-shadow support in `Logo.tsx`.
	- Form error banner updated with dark/light glass red alert styling.
	- Unit tests added: `ThemeToggle.test.tsx`.

