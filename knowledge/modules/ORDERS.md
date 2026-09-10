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
- Default Sort & Column Headers Contract (Sep 10 2026):
	- Default sort across order lists is `sortBy: "date"`, `sort: "desc"` (Order Date descending / newest first).
	- `OrderTableHeader` uses `Hash` (`#`) icon for `id` and `shopify_order_id` columns instead of misleading `ExternalLink`.
	- `OrderTableHeader` uses `mounted` state check to render neutral `ArrowUpDown` during SSR and initial client hydration, eliminating Next.js hydration mismatch errors when client sorting differs from SSR defaults.
	- `useOrderTableEffects` fallback sorting fixed to `"date"` instead of `"createdAt"` to match the column ID in `OrderColumns`.
	- `normalizeSortBy` in `urlBase.ts` normalizes `"createdAt"` to `"date"`, and `"shopify_order_id"`, `"orderId"`, `"order_id"` to `"id"`.
	- `OrderTable.tsx` uses `resolveSortId` backed by `VALID_SORT_COLUMNS` to ensure non-existent column IDs (e.g. `shopify_order_id`) are never passed to TanStack Table.
	- All order hooks (`useRepeatOrdersData`, `useFirstOrdersData`, `useCancelledOrdersData`, `useNotUploadedDocsData`) spread `DEFAULT_ORDER_FILTERS`.
	- `STORAGE_VERSION` bumped to `5` in `orderFilterUtils.ts` with automatic cleanup of legacy `createdAt` and `id` keys.
- Customer Orders First vs Repeat Contract (Sep 10 2026):
	- `/orders/customer/first` strictly filters for `order_type: 'first'` / `repeatedOrders: 0`, displaying blue `First Order` badges.
	- `/orders/customer/repeat` strictly filters for `order_type: 'repeat'` / `repeatedOrders > 0`, displaying green `Repeat (2)`, `Repeat (3)`, `Repeat (4)` badges matching the customer's order history.
	- `orderQueryHelper.ts` filters MongoDB queries with `$or` for `order_type` and `repeatedOrders` count.
	- `Order.ts` schema explicitly defines `order_type: string`, `repeatedOrders: number`, and `repeatCount: number`.
	- Seed engine (`seedDataHelper.ts` and `scripts/seed.mjs`) generates realistic recurring customers with ~35% repeat orders.
- Test Organization:
	- Subdirectories each contain their own dedicated `tests/` directory:
		- `actions/tests/`: `order.test.ts`, `consultationActions.test.ts`
		- `fetchers/tests/`: `fetchers.test.ts`
		- `utils/tests/`: `date.test.ts`, `mapperCore.test.ts`, `mapperRepeat.test.ts`, `products.test.ts`, `statusDocs.test.ts`, `statusNormalize.test.ts`
	- All 23 source files strictly satisfy the < 100 LOC target rule.
- Filters Modal Sidebar Visibility Contract (Sep 10 2026):
	- `OrderFiltersModal` renders directly in the component tree with `z-100` and `bg-slate-900/60 backdrop-blur-md` without portaling to `document.body`.
	- Uses `left: var(--sidebar-width, 17.5rem)` to offset from the sidebar (`280px` expanded, `80px` collapsed, `0px` mobile).
	- Keeps the persistent `<Sidebar>` (`z-index: 1000`) completely visible and unblurred, while keeping the modal perfectly centered in the viewable main content area across all screen resolutions (Edge, Chrome, standard 1080p 125% scale 1536x730, etc.).
- 3-State Column Sorting Cycle & Client Sorting Contract (Sep 10 2026):
	- 3-State Cycle across all 6 sortable columns (Order ID, Order Date, Status, Customer, Orders, Products):
		1. Click 1 → ASCENDING (`asc`, shows `ArrowUp`).
		2. Click 2 → DESCENDING (`desc`, shows `ArrowDown`).
		3. Click 3 → RESET / NO SORT (`undefined`, shows neutral `ArrowUpDown`, restores original dataset order without data mutation).
		- Repeat: `ASC → DESC → RESET → ASC → DESC → RESET`.
	- Single Active Sort: Only one column is active at any time. Clicking a different column immediately activates that new column in ASC on its first click, clearing the previous column.
	- Non-sortable columns: `DOCS` (`documentsUploaded`) and `ACTIONS` explicitly set `enableSorting: false`.
	- Dedicated Data-Type Comparators in `src/components/orders-table/utils/orderSorting.ts`:
		- `sortOrderId`: Numeric / string ID sorting (numeric comparison when digits present like `#100` vs `#20`, natural alphanumeric fallback).
		- `sortOrderDate`: Chronological date sorting (comparing UTC timestamps).
		- `sortStatus`: Normalized status string comparator (`fulfillment_status` or `status`).
		- `sortCustomer`: Customer name comparator using `normalizeCustomer(order).name`.
		- `sortOrdersCount`: Numeric comparator for `repeatedOrders`.
		- `sortProducts`: Numeric comparator for total product quantity/count using `getProductCount`.
	- State Preservation: `OrderTable.tsx` uses TanStack Table's `getSortedRowModel()` with `enableMultiSort: false` and `manualSorting: false`, leaving input `orders` untouched so RESET cleanly restores the original default order.
	- Decoupled Effects: Table header clicks sort client-side in memory without triggering full-page network refetches or loader flashes in `useOrderTableEffects.ts`. External filter changes still sync via `prevFilterSortRef`.
- Order Date Dynamic Relative Time Contract (Sep 10 2026):
	- Relative-Time Threshold Logic:
		- `< 1 minute` → `"Just now"`
		- `1–59 minutes` → `"X minutes ago"` (`"1 minute ago"` for singular `1`)
		- `1 hour` → `"1 hour ago"`
		- `2–23 hours` → `"X hours ago"`
		- `1 day` (calendar diff = 1 or elapsed 24-47h) → `"Yesterday"`
		- `2+ days` → `"X days ago"`
	- Timestamp Extraction: Calculates relative time directly from each order's actual `createdAt`, `orderDate`, or `date` ISO timestamp from MongoDB/API response via `mapBackendOrderToFrontend`.
	- Wall-Clock & UTC Parity: `getTimeAgo` in `src/api/services/orders/utils/date.ts` gracefully resolves local wall-clock hours persisted into UTC mock seeds while retaining millisecond precision for standard UTC dates.
	- Live Updates: `DateCell.tsx` mounts a 30-second interval via `useEffect` to periodically refresh relative time strings as time passes without full page reloads or SSR hydration mismatches.
	- Display Format: Primary value displays formatted UTC date (e.g. `"10 Sept 26"` in `text-slate-800 font-semibold`), secondary value displays dynamic relative time (e.g. `"14 minutes ago"` in `text-slate-400 font-medium`).
- Order Status Views Filtering Contract (Sep 10 2026):
	- On Hold (`/orders/status/on-hold`): Strictly filters for `fulfillmentStatus="on_hold"`. Displays 100% `ON HOLD` badges in amber pill.
	- Unfulfilled (`/orders/status/unfulfilled`): Strictly filters for `fulfillmentStatus="unfulfilled"`. Displays 100% `UNFULFILLED` badges.
	- Fulfilled (`/orders/status/fulfilled`): Strictly filters for `fulfillmentStatus="fulfilled"`. Displays 100% `FULFILLED` badges.
	- Cancelled (`/orders/status/cancelled`): Strictly filters for `fulfillmentStatus="cancelled"`. Displays 100% `CANCELLED` badges.
	- API query helper `applyStatusFilter` in `orderStatusFilter.ts` translates `fulfillmentStatus`, `fulfillment_status`, `orderStatus`, and `status` into exact MongoDB `$or` queries matching both `status` and `fulfillment_status` fields without colliding with `order_type`.
- All Orders Modal Filters Contract (Sep 10 2026):
	- Multi-field Order ID Search: `orderId` parameter searches `orderNumber`, `shopify_order_id`, and `store_order_id` in MongoDB with automatic `#` prefix stripping.
	- Comprehensive Customer Search: Supports `customerName`, `customerEmail`, `customerId`, and general `customer` matching name, email, or numeric ID across `store_order_id`, `shopify_order_id`, and `customerId`.
	- Date Boundary Resolution: Supports both camelCase (`startDate`, `endDate`) and snake_case (`start_date`, `end_date`), parsing ISO strings and YYYY-MM-DD cleanly.
	- Product Information Filters:
		- Product Type: `product_type` (`injectable`, `oral`) matches items via `orderProductFilter.ts`.
		- Product Category: `product_category` matches standard medical categories against item names and order tags.
		- Product Name: `productName` matches `items.name` via case-insensitive regex.
		- Documents: `documentStatus` (`uploaded`, `not_uploaded`) matches uploaded vs not-uploaded documents across `hasIdCard`, `hasFullPhoto`, `documentsUploaded`, and tags.
	- Special Handlers: `isUrgent` and `isParked` match boolean flags and tags (`makeurgent`, `parkedorder`).
	- Compound `$and` Architecture: All `$or` clauses are collected under `$and` so multiple simultaneous filters never clash or overwrite each other.
	- Immediate Modal Apply: The modal Search button immediately flushes pending debounce inputs (`localOrderId`, `localCustomerName`, `localProductName`) into active filters.
	- Active Chips Parity: `useActiveOrderFilters` checks `fulfillmentStatus || status` so status filter chips appear and clear reliably.


