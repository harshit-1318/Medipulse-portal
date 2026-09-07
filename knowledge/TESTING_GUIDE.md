# Frontend Testing Guide

## Stack
- Vitest
- jsdom
- @testing-library/react

## Commands
- npm test
- npm test -- --watch
- npm test -- --reporter=verbose
- npm test -- path/to/file.test.ts

## Required Minimums
- API service function: 1 success + 1 error/empty path.
- Hook: 1 success + 1 filter/sort edge case.
- Utility: 1 valid + 1 edge/empty input.

## Patterns
- Mock apiClient with vi.mock('@/api/apiClient', ...).
- Reset mocks in beforeEach.
- Test parameter mapping and default fallback behavior explicitly.

## File Placement
- API services: src/api/services/<domain>/*.test.ts or sibling .test.ts
- Hooks: src/components/<module>/hooks/__tests__/
- Utilities: alongside utility or in src/test/
