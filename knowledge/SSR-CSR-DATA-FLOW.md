# SSR + CSR Data Flow

## Current Pattern
- Astro page fetches initial data on server.
- Astro page passes initialData and initialFilters into a React component.
- React component hydrates and continues with TanStack Query on client interactions.

## Why This Matters
- Avoids first-render blank states and improves perceived performance.
- Keeps URL-derived filter state aligned between server and browser.

## Rules
- Keep server-side fetch in page-level .astro when route is SSR.
- Guard browser-only APIs (window/localStorage) before use.
- Use existing URL filter parsing utilities for initial state.
