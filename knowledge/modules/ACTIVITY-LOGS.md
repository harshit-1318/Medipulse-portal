# Module: Activity Logs

## Scope
- Activity logs listing, filtering, pagination, and audit UI.

## Main Locations
- Components: src/components/activity-logs/
  - `filters/index.ts`: Filter forms, modals, date inputs, and filter hooks
  - `hooks/index.ts`: Activity logs data fetching & site options hooks
  - `table/index.ts`: Table rows, cells, headers, and React Table configuration
  - `utils/index.ts`: Action formatting, styling configs, and row grouping helpers
- Pages: src/pages/activity-logs/
- API service: src/api/services/activity-log/
- Component Tests: src/components/activity-logs/__tests__/

## Notes
- Keep filter/sort params centralized in service builders.
- Validate date filter handling in both SSR and client refresh paths.
- Activity filters modal uses standardized `bg-slate-900/60 backdrop-blur-md` overlay, `style={{ left: "var(--sidebar-width)" }}` content centering, `Active Filters` header, and ESC/click-outside dismiss to match the unified portal design system.
- Super-admin behavior:
	- default Activity Logs view should load all sites (no implicit site filter).
	- optional Site dropdown filter should send `siteId` when selected.
	- keep `All Sites` option mapped to empty `siteId`.
- Include explicit email action values in dropdown options when backend introduces new action types (for example `email_skipped`) so operators can filter queue/debug entries directly.
- Added dedicated page `src/pages/activity-logs/email-history.astro` for sent-email timeline view, implemented via the shared activity logs component with `defaultAction=email_sent`.
- Sidebar now exposes Activity Logs as a submenu with `All Activity` and `Email History` entries.
- Activity table supports optional order sub-grouping (`enableOrderSubgrouping`), but it is defaulted to `false` on `/activity-logs` to preserve strict chronological date order (newest activities of today at the top, without separating non-order events into a bottom bucket).
- Added color-coded role badges to the `USER` column in `ActivityUserCell` using `getRoleBadgeConfig()` (`super_admin` purple, `admin` blue, `prescriber` green, `pharmacist` amber, `customer_support` teal).
- Added `User Role` dropdown filter to `ActivityFiltersModal` using `ROLE_OPTIONS` and wired through `useActivityFilters` and `buildActivityLogParams`.
- Persistent MongoDB Activity Logging: Created `ActivityLog` Mongoose model and `recordActivity()` helper (`src/lib/db/logActivityHelper.ts`).
- Login & Logout Audit Trail: Wired `recordActivity` into `/api/auth/login` (`login_success`) and `/api/auth/logout` (`logout`), recording user name, email, role, and exact timestamps into MongoDB.
- `POST /api/activity-log` persists real incoming activities into MongoDB.
- `GET /api/activity-log/list/filters` queries MongoDB `ActivityLog.find(query).sort({ createdAt: -1 })` with dynamic role, search, action, and orderId filtering, auto-seeding starting historical baseline if empty.

## Super-Admin Activity Dashboard
- Component: `src/components/super-admin/ActivityDashboardSection.tsx`
- Rendered at: `/super-dashboard` — appended below the sites list in `SuperAdminDashboardPage.tsx`.
- API function: `getActivityDashboard(days?)` in `src/api/services/superAdminService.ts` → `GET /super-admin/activity-dashboard?days=<n>`.
- Backend endpoint: `GET /super-admin/activity-dashboard` — SUPER_ADMIN-only, single `$facet` MongoDB aggregation in `SuperAdminService.getActivityDashboard()`.
- Response shape: `ActivityDashboard` interface — period, totals (events/uniqueUsers/userEvents/systemEvents/failedLogins), byDay, byActionType, bySource, byBrowser, byOS, byDevice, topUsers, recentLogins, recentFailedLogins.
- Period selector: 7 / 30 / 90 days — re-fetches on change. All period aggregations respect the days window **except** `recentLogins` and `recentFailedLogins` which always show the latest 10 regardless of window.
- All charts are pure CSS/Tailwind (BarList, DailySparkline, SourceBreakdown) — no external chart library.
- `getActivityDashboard()` is error-safe: returns the `EMPTY_DASHBOARD` constant on any fetch failure so the component never crashes.
- Adding new action types to the backend does NOT require any frontend change — the bar list renders whatever `byActionType` returns.
- Next.js 16 SSR & Hydration: `ActivityLogsRoute` and `EmailHistoryRoute` use `dynamic(() => import('@/components/activity-logs/ActivityLogsContent'), { ssr: false })` to prevent server/client hydration mismatch when deep-linking or refreshing with URL query parameters (`?page=2`) or localStorage filter persistence.
- `Pagination` and `ActivityTable` guard `derivedTotalPages` so total pages never evaluates to less than `currentPage` during loading states, with `suppressHydrationWarning` on pagination buttons and page counter.
- Audit Log Test Isolation: In `src/lib/db/logActivityHelper.ts`, `recordActivity` short-circuits in test environments (`process.env.NODE_ENV === 'test' || process.env.VITEST`), completely preventing automated test suites from polluting live MongoDB activity records with synthetic logins or logouts.
- Real-Time De-Duplication: `recordActivity` enforces a 10-second deduplication check for identical user and action pairs, preventing double-clicks or rapid consecutive auth requests from generating duplicate entries in the database.
