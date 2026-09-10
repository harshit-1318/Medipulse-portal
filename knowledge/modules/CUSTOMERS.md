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
- Standardized UI Design System Contract (Sep 10 2026):
  - Page header uses clean bold `h1` without icon badge box, matching Orders Filters.
  - Table header uses 14px font, `#` Hash icon for `# CUSTOMER ID`, and standardized indigo sort arrows (`text-indigo-600` / `ArrowUpDown`).
  - Table card uses standardized Filters button (`text-[14px] font-semibold rounded-lg` with indigo active state and 16px icon) and active chips matching `FilterBadgesGroup`.
  - Pagination container is unconditionally rendered at bottom of table card.
  - Filters modal uses standard `rounded-3xl` container, teal header with subtitle, teal icon section header, clean `h-9.5` inputs, and `Clear All` + `Apply Filters` buttons.
