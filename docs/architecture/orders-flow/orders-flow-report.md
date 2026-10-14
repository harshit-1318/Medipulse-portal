# MediPulse Healthcare Portal — Orders Lifecycle & Clinical Workflow Architecture Report

**Document Version:** 1.0.0  
**Domain Scope:** Order Processing, Clinical Workflow, Prescription Dispensing, and Table State Synchronization  
**Framework Baseline:** Next.js 16 App Router · React 19 · TypeScript · MongoDB Atlas (Mongoose 9) · TanStack Query · Axios  

---

## 1. Executive Summary

The Orders Lifecycle is the primary operational heartbeat of the MediPulse Portal. It enables doctors, clinical prescribers, pharmacists, pharmacy staff, and customer support representatives to review, approve, dispense, park, and ship pharmaceutical orders across multiple healthcare domains.

Every stage of this flow adheres to the project's strict architecture guidelines:
- All external and internal calls route through `apiClient` with automatic Bearer and `X-SITE-*` headers.
- Query sorting passes through `normalizeSortOrder(filters.sort)` to prevent backend crashes.
- Dual-layer URL synchronization (`useUrlSync`) maintains state parity between browser address bars, localStorage caches, and TanStack Table hooks.

---

## 2. Step-by-Step Order Execution Lifecycle

```
[Orders Table Page] ───► [useAllOrdersData] ───► [buildOrderParams] ───► [apiClient.get]
                                                                                │
[Order Details Drawer] ◄── [TanStack Table] ◄── [Response Envelope] ◄── [GET /api/orders]
         │                                                                      │
         ▼                                                                      ▼
[Prescriber Approval] ──► [POST /api/orders/update-status] ────────► [verifyApiAuth Guard]
         │                                                                      │
         ▼                                                                      ▼
[Pharmacist Dispense] ──► [POST /api/prescriptions] ──────────────► [MongoDB Order.find]
```

### Step 1: Orders Table Route Mount
- **Route:** `src/app/(dashboard)/orders/all/page.tsx`
- **Shell Component:** Renders orders view wrapped in `DashboardLayout`, which mounts the persistent `Sidebar`, `Header`, and `IdleSessionManager`.

### Step 2: Hook Initialization (`useAllOrdersData`)
- **File:** [`src/components/orders-table/hooks/useAllOrdersData.ts`](file:///D:/New%20projects/1%20MediPulse/src/components/orders-table/hooks/useAllOrdersData.ts)
- **State Hooks:**
  - `page`: Initialized from URL param or localStorage key (`getDashboardStorageKey("all")`).
  - `filters`: Default filters merged with stored presets.
  - `orders`: Array of `OrderType` objects.
  - `total`: Total matching records for pagination.
- **URL Synchronization:**
  - Calls `useUrlSync(filters, setFilters, page, setPage, storageKey, DEFAULT_FILTERS)`.
  - When user modifies page or filters, URL query parameters (`?page=2&status=pending&sortBy=createdAt&sort=desc`) update automatically without triggering a full page reload.

### Step 3: Parameter Builder Normalization (`buildOrderParams`)
- **File:** [`src/api/services/orders/buildParams.ts`](file:///D:/New%20projects/1%20MediPulse/src/api/services/orders/buildParams.ts)
- **Compliance Rules:**
  - `sort: normalizeSortOrder(filters.sort || "asc")` strictly normalizes sort directions.
  - `sortMapping` translates frontend column keys (`date` ➔ `createdAt`, `id` ➔ `shopify_order_id`, `repeatedOrders` ➔ `repeatCount`).
  - Smart search parsing: detects email addresses (`@`), numeric customer IDs (`^\d+$`), or text customer names.

### Step 4: API Client Service Call (`getOrders`)
- **File:** `src/api/services/orders/fetchers/core.ts`
- Dispatches `apiClient.get('/orders', { params })`.
- `apiClient` request interceptor ([`src/lib/api/interceptors.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/api/interceptors.ts)) automatically attaches:
  - `Authorization: Bearer <token>`
  - Multi-tenant site headers: `X-SITE-ID`, `X-SITE-KEY`, `X-SITE-HOST`.
  - Global loader activation: `startLoader("all-orders")`.

### Step 5: Serverless Route Handler (`GET /api/orders`)
- **File:** [`src/app/api/orders/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/orders/route.ts)
- **RBAC Auth Guard:**
  ```typescript
  const auth = await verifyApiAuth(request, {
    requiredRoles: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'pharmacy_staff', 'customer_support', 'driver'],
  });
  if (!auth.authorized) return auth.errorResponse!;
  ```
- **Query Builder:** [`src/app/api/orders/orderQueryHelper.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/orders/orderQueryHelper.ts) constructs Mongoose filters from search parameters.

### Step 6: MongoDB Atlas Query Execution
- **File:** [`src/lib/db/models/Order.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/models/Order.ts)
- Executes cached connection pool query:
  ```typescript
  let total = await Order.countDocuments(query);
  let orders = await Order.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  ```
- Returns 200 OK with `{ status: 'SUCCESS', success: true, data: { orders, total, page, limit } }`.

### Step 7: Order Details Drawer Inspection
- **File:** [`src/components/order-details/OrderDetailsDrawer.tsx`](file:///D:/New%20projects/1%20MediPulse/src/components/order-details/OrderDetailsDrawer.tsx)
- Clicking any order row opens the slide-out drawer displaying:
  - Patient demographics & medical questionnaire summary.
  - Prescribed medication items (e.g. Semaglutide, Tirzepatide).
  - Prescription verification badge (`verified`, `pending_doctor_review`).
  - Internal clinical notes (`/api/order-notes`).

### Step 8: Clinical Actions & Status Transitions
- **Files:**
  - `src/app/api/orders/update-status/route.ts`
  - `src/app/api/orders/make-urgent/route.ts`
  - `src/app/api/orders/parked-order/route.ts`
- **Clinical Progression Matrix:**
  1. `pending` ➔ Patient placed order via survey.
  2. `pending_doctor_approval` ➔ Intake questions flagged for prescriber review.
  3. `doctor_approved` ➔ Doctor signs electronic prescription.
  4. `pharmacist_dispensed` ➔ Pharmacist dispenses medication from inventory.
  5. `pharmacy_packed` ➔ Staff packages medication pen and cold-chain pack.
  6. `shipped` / `delivered` ➔ Driver dispatched with delivery tracking.

---

## 3. Verified File Map

| Component / Function | File Path | Line Range | Architectural Responsibility |
| :--- | :--- | :---: | :--- |
| **Orders Page Shell** | `src/app/(dashboard)/orders/all/page.tsx` | L1-30 | Orders dashboard layout |
| **useAllOrdersData Hook** | `src/components/orders-table/hooks/useAllOrdersData.ts` | L13-64 | Data loading, pagination & URL sync |
| **buildOrderParams** | `src/api/services/orders/buildParams.ts` | L4-60 | Sorting & filter normalization |
| **apiClient Singleton** | `src/lib/api/client.ts` | L1-52 | Interceptor-driven Axios instance |
| **GET /api/orders** | `src/app/api/orders/route.ts` | L7-74 | Authenticated order list handler |
| **orderQueryHelper** | `src/app/api/orders/orderQueryHelper.ts` | L1-80 | Construct MongoDB filters |
| **Order Mongoose Model** | `src/lib/db/models/Order.ts` | L1-55 | Typed schema for orders collection |
| **Order Details Drawer** | `src/components/order-details/OrderDetailsDrawer.tsx` | L1-120 | Slide-out patient & order viewer |
| **Prescriptions Handler**| `src/app/api/prescriptions/route.ts` | L5-45 | Clinical prescription review API |
