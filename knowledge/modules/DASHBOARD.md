# Module: Dashboard

## Scope
- Dashboard widgets, summaries, and top-level analytics views.

## Main Locations
- Components: src/components/dashboard/
- Pages: src/pages/dashboard/
- API service: src/api/services/dashboardService.ts

## Notes
- Keep dashboard data contracts typed and resilient to partial responses.
- Prefer lightweight loading states to avoid blocking first render.
- Auth/session expiry must redirect immediately on client-side 401 responses; otherwise dashboard order/stats fallbacks can appear as valid "0" values until refresh.
- Dashboard stats metrics must use nullish coalescing (`?? 0`) rather than falsy fallbacks (`|| 2`) to ensure that legitimate zero-counts in clean/empty database states are not replaced with fabricated test values.
- Super Admin Overview `/super-dashboard`:
  - `totalActivities` derives directly from `ActivityLog.countDocuments()`.
  - Activity log dashboard queries live MongoDB `ActivityLog` via `src/app/api/super-admin/activity-dashboard/activityAggregator.ts`, dynamically computing metrics, `byDay` histograms, top actions, active staff, and recent logins for any requested `days` window (`7 days`, `30 days`, `90 days`).
  - Protected with `verifyApiAuth(request, { requireSuperAdmin: true })`.
- Role-based Dashboard Views:
  - Role-based header displays customized titles (`Admin Operations Dashboard`, `Clinical & Prescriptions Dashboard`, `Pharmacy Dispensing Dashboard`, `Pharmacy Operations Dashboard`, `Customer Support Dashboard`, `Logistics & Deliveries Dashboard`, `Customer Account Dashboard`).
  - Renders `CustomerDashboardView` for `customer`/`user`, `DriverDashboardView` for `driver`, and `StatCardsSection` + `OrderTable` for staff/admins.

