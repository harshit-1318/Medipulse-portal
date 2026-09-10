# Module: Site Settings

## Scope
- Site configuration UI and branding/settings updates.

## Main Locations
- Components: src/components/site-settings/
- Pages: src/pages/sites/
- API service: src/api/services/siteService.ts
- Store: src/store/siteStore.ts

## Notes
- Site identity keys must remain consistent with interceptor header injection.
- Any storage key rename requires coordinated update in siteStore and apiClient docs.
- UI follows Orders Filters design system: clean single `h1` header, 14px uppercase column headers with Lucide sort arrows (`text-indigo-600`), and standardized `ActionButton` row actions.
