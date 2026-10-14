# MediPulse Healthcare Portal — Dual-Endpoint Customers & Sorting/Filtering Architecture Report

**Document Version:** 1.0.0  
**Domain Scope:** Customer Management, Dual-Endpoint Dispatching, Sort Normalization, BIGINT Data Sanitation  
**Framework Baseline:** Next.js 16 App Router · React 19 · Axios · TanStack Table · TypeScript  

---

## 1. Executive Summary

The Customer module in MediPulse features a specialized **Dual-Endpoint Architecture** documented in `.agents/rules/03-sorting-and-filtering.md`. Because the backend supports both a fast, lightweight index endpoint and an advanced multi-faceted Elasticsearch/database search pipeline, the frontend dynamically routes API requests based on query complexity.

Additionally, data normalization rules ensure that arbitrary MongoDB Long/BIGINT identifiers (`rawId.low`) and inconsistent sorting strings (`'ascending'`, `'descending'`, `'dsc'`) are sanitized before touching the UI or API.

---

## 2. Dual-Endpoint Execution Lifecycle

```
[Customers Table Mount] ──► [useCustomersPage] ──► [buildCustomerParams]
                                                           │
                      ┌────────────────────────────────────┴────────────────────────────────────┐
                      ▼                                                                         ▼
            [Condition: Clean State]                                                  [Condition: Filtered/Sorted]
         (!hasActiveFilters && !sortBy)                                            (hasActiveFilters || customSort)
                      │                                                                         │
                      ▼                                                                         ▼
         [GET /orders/customers/list]                                              [GET /orders/search?type=customers]
                      │                                                                         │
                      └────────────────────────────────────┬────────────────────────────────────┘
                                                           ▼
                                                [normalizeCustomer() Mapper]
                                                           │
                                                           ▼
                                                [BIGINT ID Sanitization]
                                                           │
                                                           ▼
                                              [TanStack Table View Render]
```

### Step 1: Initial Mount & isInitialLoad Flag
- **File:** `src/components/customers/hooks/useCustomersPage.ts`
- Uses `useRef(true)` for tracking initial render.
- Syncs state with URL query parameters via `useUrlSync`.

### Step 2: Sort Direction Normalization (`normalizeSortOrder`)
- **Golden Rule:** Backend endpoints break if passed raw strings like `'ascending'`.
- Normalizer strictly evaluates:
  ```typescript
  import { normalizeSortOrder } from '@/utils/url/urlBase';
  params.sort = normalizeSortOrder(filters.sort); // Strictly 'asc' | 'desc'
  ```

### Step 3: Dual-Endpoint Routing Condition
- **File:** [`src/api/services/customer/service.ts:25-28`](file:///D:/New%20projects/1%20MediPulse/src/api/services/customer/service.ts#L25-L28)
- **Logic:**
  ```typescript
  const hasActiveFilters = !!(
    params.search ||
    params.customerId ||
    params.customerEmail ||
    params.customerName ||
    params.totalPens ||
    params.customer_start_date
  );
  const isNoneState = !params.sortBy;

  const url = (!hasActiveFilters && isNoneState)
    ? "/orders/customers/list"
    : "/orders/search";
  ```

### Step 4: Data Normalization & BIGINT Safety
- **File:** [`src/api/services/customer/mappers.ts:6-20`](file:///D:/New%20projects/1%20MediPulse/src/api/services/customer/mappers.ts#L6-L20)
- In MongoDB, 64-bit integers often serialize as `{ low, high }` objects.
- `normalizeCustomer(c)` safely parses:
  ```typescript
  export function normalizeCustomer(c: any): Customer {
    const rawId = c?.customerId;
    const customerId = typeof rawId === "object" && rawId !== null 
      ? String(rawId.low ?? rawId) 
      : String(rawId ?? "");

    return {
      customerId,
      name: c?.name?.trim() || "N/A",
      email: c?.email?.trim() || "N/A",
      totalOrders: Number(c?.totalOrders ?? 0),
      totalPens: Number(c?.totalPens ?? 0),
      createdAt: c?.createdAt || c?.created_at || "",
    };
  }
  ```

---

## 3. Verified File Map

| Component / Function | File Path | Line Range | Architectural Responsibility |
| :--- | :--- | :---: | :--- |
| **getCustomers** | `src/api/services/customer/service.ts` | L11-44 | Dual-endpoint selection & dispatch |
| **normalizeCustomer** | `src/api/services/customer/mappers.ts` | L6-20 | BIGINT safe parsing & record sanitization |
| **buildCustomerParams**| `src/api/services/customer/params.ts` | L1-40 | Param construction & sort normalization |
| **normalizeSortOrder** | `src/utils/url/urlBase.ts` | L1-30 | Enforces `'asc' \| 'desc'` sort parity |
| **Customer Model** | `src/lib/db/models/Customer.ts` | L1-35 | MongoDB schema for patient profiles |
