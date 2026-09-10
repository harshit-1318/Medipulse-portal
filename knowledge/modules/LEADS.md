# Module: Leads

## Scope
- Lead list, filters, assignment, and lead workflow interactions.

## Main Locations
- Components: src/components/leads/
- Pages: src/pages/leads/
- API service: src/api/services/leadService.ts
- Types: src/types/lead.ts

## Notes
- Keep filter serialization consistent between URL and service calls.
- Add tests when introducing new lead workflow actions.
- UI aligns with Orders Filters design system: clean single `h1` header, 14px uppercase column headers, and standardized cyan `ActionButton` for row viewing.
