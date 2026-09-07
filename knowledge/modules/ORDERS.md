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
- Re-Sync endpoint behavior:
	- `resyncOrder` / `resyncOrderFromShopify` calls `POST /orders/:id/resync` to trigger an order data re-sync from the connected e-commerce store.
- Test Organization:
	- Subdirectories each contain their own dedicated `tests/` directory:
		- `actions/tests/`: `order.test.ts`, `consultationActions.test.ts`
		- `fetchers/tests/`: `fetchers.test.ts`
		- `utils/tests/`: `date.test.ts`, `mapperCore.test.ts`, `mapperRepeat.test.ts`, `products.test.ts`, `statusDocs.test.ts`, `statusNormalize.test.ts`
	- All 23 source files strictly satisfy the < 100 LOC target rule.
