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
- Standardized UI Design System Contract (Sep 10 2026):
  - Page header uses clean bold `h1` without icon badge box, matching Orders Filters.
  - Table header uses 14px font, `#` Hash icon for Order ID (`createdAt`/`shopifyOrderId`), and standardized indigo sort arrows (`text-indigo-600` / `ArrowUpDown`).
  - Table card uses standardized Filters button (`text-[14px] font-semibold rounded-lg` with indigo active state and 16px icon) and active chips matching `FilterBadgesGroup`.
  - Pagination container is unconditionally rendered at bottom of table card.
  - Filters modal uses standard `rounded-3xl` container, teal header with subtitle, teal icon section headers, clean `h-9.5` inputs, and `Clear All` + `Search` buttons.
