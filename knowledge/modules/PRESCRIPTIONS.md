# Module: Prescriptions

## Scope
- Prescription list/detail workflows and related actions.

## Main Locations
- Components: src/components/prescriptions/
- Pages: src/pages/prescriptions/
- API service: src/api/services/prescriptionService.ts
- Types: src/types/prescription.ts

## Notes
- Keep protected route coverage in middleware aligned with prescription pages.
- Validate filter and status mappings against backend response formats.
- Filter & Search Architecture (Oct 15 2026):
  - Filters modal flushes text inputs immediately on "Search" click via `applyFilters()`, bypassing debounce lag.
  - API Param Mapping:
    - `orderId`: `#` prefix stripped, special regex chars escaped, matches `orderNumber`, `shopifyOrderId`, and `storeOrderId`.
    - `customerId`: trims whitespace, escapes regex, matches `customerId`, `storeOrderId`, and `shopifyOrderId`.
    - `prescriber`: unified search matching `pharmacistName`, `pharmacistEmail`, `pharmacistRegNo`, and `gphcNumber`.
    - `orderDate`: parsed via `parseDateBoundary` into single-day UTC boundaries (`$gte` start of day, `$lte` end of day) on `orderDate` and `createdAt`. Defensively falls back on malformed input to avoid Mongoose CastErrors.
    - `reviewDate`: parsed via `parseDateBoundary` into single-day UTC boundaries on `generatedAt`. Kept strictly independent from `orderDate`.
  - Sorting: Sort direction normalized via `normalizeSortOrder()`. Maps `orderDate`, `createdAt`, `customerId`, `pharmacistName`, `generatedAt`, `shopifyOrderId`.
- Testing:
  - Unit tests: `src/app/api/orders/prescription-list/__tests__/prescriptionFilterQuery.test.ts`, `src/api/services/prescription/__tests__/prescriptionService.test.ts`, `src/components/prescriptions/hooks/__tests__/usePrescriptionFilters.test.ts`
  - E2E tests: `e2e/prescriptions/prescriptions-filters.spec.ts`

