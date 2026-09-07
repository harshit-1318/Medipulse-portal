# Module: Common

## Scope
- Shared UI primitives and cross-module reusable components.

## Main Locations
- Components: src/components/common/
  - `table/index.ts`: TableRow, Badge, and ActionButton primitives
  - `Logo.tsx`: SVG vector white-label logo with theme toggle support
  - `Pagination.tsx`: Paginated controls with item/page calculations
  - `QueryProvider.tsx`: Global React Query client provider with site init guard
  - `RouteLoadingProgress.tsx`: Top progress bar for route transitions
- Component Tests: src/components/common/__tests__/
  - `Logo.test.tsx`: Theme-based logo rendering
  - `Pagination.test.tsx`: Page derivation and navigation triggers
  - `TableUI.test.tsx`: TableRow, Badge variants, and ActionButton interaction
- Shared hooks: src/hooks/
- Shared utils: src/utils/

## Notes
- Prefer reusing existing primitives before introducing new variants.
- Keep cross-module utilities pure and tested.
- All files strictly adhere to the < 100 LOC rule.
