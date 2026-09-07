# 03. Sorting, Filtering & Data Normalization Patterns

## 🔄 Sorting & Filtering Patterns

### Sort direction — ALWAYS normalize
```typescript
import { normalizeSortOrder } from '@/utils/url/urlBase';

// ❌ WRONG — raw string
sort: filters.sort || 'asc'

// ✅ RIGHT — normalized
sort: normalizeSortOrder(filters.sort)
// Returns strictly 'asc' | 'desc', handles 'ascending', 'descending', 'dsc', undefined
```

### URL state sync
Filters and page are synced to URL params using `window.history.pushState` (no page reload). Use `parseFiltersFromParams` and `getInitialOrderFilters` from `src/utils/url/orderFilterUtils.ts` to read initial state from URL on mount.

```typescript
// Reading filters from URL on mount
import { getInitialOrderFilters } from '@/utils/url/orderFilterUtils';
const filters = getInitialOrderFilters(DEFAULT_FILTERS, 'myStorageKey');
```

### Sort field mapping
When sending sort fields to the backend, map UI field names to backend field names in the param builder:
```typescript
const sortMapping: Record<string, string> = {
  date: 'createdAt',
  customer: 'customer',
  repeatedOrders: 'repeatCount',
  // ...
};
const finalSortBy = sortMapping[filters.sortBy] || filters.sortBy || 'createdAt';
```

---

## 🛍️ Dual-Endpoint Customer List Pattern

The customer list uses two different backend endpoints depending on context:

| Condition | Endpoint |
|-----------|----------|
| Initial load, no filters, default sort (createdAt desc) | `GET /orders/customers/list` |
| Any filter active, custom sort, or not initial load | `GET /orders/search?type=customers` |

```typescript
// customer/index.ts — DO NOT break this logic
const url = (params.isInitialLoad && !hasActiveFilters && isDefaultSort)
  ? '/orders/customers/list'
  : '/orders/search';
```

Always pass `isInitialLoad: true` only on the first render (use a `useRef` flag, as in `useCustomersPage.ts`).
