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
