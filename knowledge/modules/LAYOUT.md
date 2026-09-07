# Module: Layout

## Scope
- Shared layout shells and navigation wrappers.

## Main Locations
- Layouts: src/layouts/
- Components: src/components/layout/

## Notes
- Changes in layout auth assumptions must be checked against middleware protection.
- Keep responsive behavior consistent across dashboard and non-dashboard pages.
- Sidebar branding is site-driven:
	- Expanded sidebar logo reads `siteInfo.logo`.
	- Collapsed sidebar icon reads `siteInfo.small_icon_url`.
	- Both retain static fallback assets for missing values.
- Browser tab favicon is site-driven:
	- Favicon is applied from `siteInfo.small_icon_url` during site initialization.
	- Falls back to `/favicon.svg` when `small_icon_url` is empty.
- Super-admin navigation has full, universal visibility across the entire portal:
	- Dashboard (`/super-dashboard`)
	- Operational Pages: Orders Filters (`/orders/*`), Prescriptions (`/prescriptions`), Customers (`/customers`)
	- Admin: Sites (`/sites`), Users (`/users`), Activity Logs (`/activity-logs`, `/activity-logs/email-history`), Queue Monitor (`/queue-monitor`), Docman Jobs (`/docman-jobs`), Surveys (`/surveys/*`), Leads / CRM (`/leads`)
- Sidebar sections with zero visible items for the current role should not render (avoid empty headers).
- Sidebar Admin navigation uses `Activity Logs` as a parent with sub-items:
	- `All Activity` -> `/activity-logs`
	- `Email History` -> `/activity-logs/email-history`
- Queue Monitor navigation (`/queue-monitor`) is accessible under Admin section for admin and super_admin.
- Collapsed sidebar behavior:
	- Parent items with children render a flyout submenu on hover/focus in collapsed mode.
	- Expanded mode remains click-to-toggle for child menus.
	- User collapse preference persists across refresh via localStorage key `sidebar-collapsed`.
	- Container overflow rules must preserve flyout visibility in collapsed mode:
		- sidebar scroll container: `overflow-x-visible` when collapsed
		- section wrapper: `overflow-visible` when collapsed
	- Flyout layering/hover continuity rules:
		- collapsed flyout should be flush with the parent (avoid left gap that breaks hover chain)
		- collapsed flyout should render through a body portal (`createPortal`) with fixed positioning to escape parent stacking contexts
		- portal flyout currently uses explicit high z-index (`2000`) for overlap safety
		- sidebar shell should be above dashboard main pane (current sidebar: `zIndex: 1000`)
		- dashboard main pane should stay on base layer (`relative z-0`)
