# Module: Orders

## Scope
- Order table, searching, sorting, pagination, and order-level actions.

## Main Locations
- Components: src/components/orders-table/
- Pages: src/pages/orders/
- API services: src/api/services/orders/ and src/api/services/orderService.ts

## Notes
- Keep backend sort mapping centralized in parameter builder functions.
- Preserve SSR initial fetch + client query continuation pattern.
- Status mapping parity rule (May 1 2026):
	- Order list status must use the same precedence as order details.
	- If either status source reports `on_hold` (including `on hold`), display **On Hold**.
	- List mapping should read root, nested `orderInfo`, and Shopify raw payload fields (`raw_data.fulfillment_status`) because some list responses carry stale top-level `status` values.
- Documents column contract (Apr 27 2026):
	- `OrderType.documentItemsStatus` carries `{ id, fullPhoto, video }` booleans.
	- `DocsCell` renders three stacked rows (`ID`, `Full Photo`, `Video`) with Uploaded/Not Uploaded per row.
	- Existing `documentsUploaded` remains for legacy aggregate behavior and filters (ID + Full Photo only).
	- Docs column sorting is intentionally disabled in the table UI; docs visibility is per-item display only and should not control table ordering.
