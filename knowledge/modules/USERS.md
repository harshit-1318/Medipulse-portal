# Module: Users

## Scope
- User management, role controls, and permissions-aware UI behavior.

## Main Locations
- Components: src/components/users/
- Pages: src/pages/users/
- API service: src/api/services/userService.ts

## Notes
- Maintain role-based rendering from user store state.
- Ensure new user admin pages remain under protected middleware routes.
- In user edit mode, only super_admin should see password visibility controls; other roles keep masked password input.
- Users list includes an `Edit` action per row (`/users/:id/edit`) so admins/super-admins can update user password and profile details without leaving the list flow.
- `createdAt` display in list rows should use safe date parsing with fallback to avoid `Invalid Date` UI noise.
- Users list now includes `View`, `Edit`, and `Disable/Enable` row actions.
- `Disable/Enable` uses user patch updates (`is_active`) and blocks super-admin disable from list actions.
- Disable now has a two-step verification flow in list actions:
	- confirmation dialog with user details,
	- email re-entry verification before applying disable.
- Added user detail page at `/users/:id` with user profile summary and user-scoped activity history table.
- Users list now relies on backend server-side `search/page/limit/sort` support from `GET /users` for consistent pagination totals.
- Canonical user detail endpoint is `/users/:id` (plural). Keep `/user/:id` only as legacy fallback in service helpers.
- User form site selection uses site `_id` values for API compatibility (not `site_key`).
- User detail activity logs use local state without URL query syncing to keep `/users/:id` route clean.
- On `/users/:id`, mount the activity-log hook only after `user.email` is known and pass `defaultFilters.search = userEmail` to avoid an initial unfiltered fetch (all logs) and first-load UI blocking.
- Do not force `ActivityTable` filter modal open on user detail (`filtersEnabled={true}` + no-op setter) — it mounts a full-screen overlay and blocks all page interaction.
- `/users/:id` now shows a `UserActivitySummary` panel (above the raw activity table) with a range picker, stat cards, and a collapsible per-action breakdown table. Data comes from `GET /activity-log/user-summary?userEmail=`.
- `Orders Viewed` in `UserActivitySummary` must use backend `uniqueOrdersViewed` (distinct order IDs viewed in the selected range), not raw summed `order_viewed` event count.
- The daily summary now includes approximate active-time metrics from backend (`activeMinutes`, `activeHoursApprox`, `sessionCount`) and displays `Active Hours (Approx)` in the stat cards.
- User detail summary requests now pass client timezone and local-date ranges to backend so "Today" aligns with the visible activity timeline.
- Active-hours approximation excludes login actions from duration math; login events still appear in the activity table/action counts.
- Users pages should not nest additional `QueryProvider` wrappers; they are already wrapped at app layout level. Nested providers can cause extra full-screen initializing overlays.
- User creation is handled via `POST /api/users` and `createUser()` in `userService.ts` with MongoDB Atlas persistence and duplicate email validation.
- User detail/edit/delete operations are handled via `GET`, `PATCH`/`PUT`, and `DELETE` at `/api/users/[id]`.
- UI aligns with Orders Filters design system: clean single `h1` header, integrated table card header with `[#003B73]` typography, count pill, gradient accent bar, 14px uppercase column headers, and standardized `ActionButton` row buttons.

