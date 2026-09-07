# URL, Sort, and Filter Guide

## Core Rule
- Always pass sort direction through normalizeSortOrder().

## State Sync
- Keep filters/page in URL via pushState for navigable, shareable state.
- Parse initial filter state from URL before first client fetch.

## Sort Mapping
- Map UI sort fields to backend field names in API param builders.
- Avoid hardcoding backend sort fields in component presentation logic.

## Customer Endpoint Rule
- Keep dual-endpoint behavior intact:
  - default initial load can use /orders/customers/list
  - filtered/custom sort paths should use /orders/search type=customers
