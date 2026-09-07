# Module: Customers

## Scope
- Customer list, filtering, sorting, pagination, and detail navigation.

## Main Locations
- Components: src/components/customers/
- Pages: src/pages/customers/
- API service: src/api/services/customer/
- Types: src/types/customer.ts

## Critical Rule
- Preserve dual-endpoint behavior for initial default load vs filtered/custom sort state.

## Notes
- Keep sort normalization and field mapping in service param logic.
- API service in `src/api/services/customer/` is modularized mirroring `activity-log`:
  - `index.ts`: Clean barrel re-exports (`types`, `service`, `mappers`, `params`, `utils`).
  - `service.ts`: Core API calls (`getCustomers`, `filterCustomers`).
  - `params.ts`: Parameter building logic (`buildCustomerParams`).
  - `mappers.ts`: Normalization logic (`normalizeCustomer`).
  - `types.ts`: Service types re-exported from `@/types/customer`.
  - `utils.ts`: Backward-compatibility re-exports.
  - `tests/`: Dedicated unit test folder (`service.test.ts`, `params.test.ts`, `mappers.test.ts`).
