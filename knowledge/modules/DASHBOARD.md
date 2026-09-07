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
