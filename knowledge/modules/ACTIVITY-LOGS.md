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
- Activity filters modal intentionally uses no dark/blurred full-screen backdrop; keep the modal container neutral (no `bg-slate-900/60` and no `backdrop-blur-md`) unless product requirements change.
- Super-admin behavior:
	- default Activity Logs view should load all sites (no implicit site filter).
	- optional Site dropdown filter should send `siteId` when selected.
	- keep `All Sites` option mapped to empty `siteId`.
- Include explicit email action values in dropdown options when backend introduces new action types (for example `email_skipped`) so operators can filter queue/debug entries directly.
- Added dedicated page `src/pages/activity-logs/email-history.astro` for sent-email timeline view, implemented via the shared activity logs component with `defaultAction=email_sent`.
- Sidebar now exposes Activity Logs as a submenu with `All Activity` and `Email History` entries.
- Activity table now supports opt-in order sub-grouping in the render layer (`enableOrderSubgrouping`) so rows are visually partitioned as `Order #<id> (count)` with a fallback `No Order ID` group rendered at the bottom.
- Sub-grouping is enabled for both Activity Logs routes via `ActivityLogsContent` and remains disabled for other `ActivityTable` consumers unless explicitly enabled.
- In subgroup headers, the order number is clickable and opens `/orders/view/<id>` in a new tab to speed order-level investigation.
- Order ids that are effectively missing (`""`, whitespace, `"0"`, `"null"`, `"undefined"`) are treated as no-order activity and are subgrouped by user identity label (`userEmail` fallback `userName`) instead of showing `Order #0` buckets.

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
