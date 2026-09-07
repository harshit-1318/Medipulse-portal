# Frontend Knowledge Index

This folder mirrors the backend knowledge pattern and centralizes frontend architecture, patterns, and module-level documentation.

## Read Order
1. PROJECT-STATE.md
2. INDEX.md
3. Task-specific guide(s)
4. Module file in modules/

## Core Files
| Need | File |
|---|---|
| Current focus, recent work, testing status | PROJECT-STATE.md |
| Common frontend pitfalls and fixes | GOTCHAS.md |
| Vitest patterns and conventions | TESTING_GUIDE.md |
| Frontend env flags and debug toggles | ENV-VARIABLES-GUIDE.md |
| Shared axios wrapper, headers, interceptors | API-CLIENT-GUIDE.md |
| Astro SSR + React hydration flow | SSR-CSR-DATA-FLOW.md |
| Auth and route protection | AUTH-MIDDLEWARE-GUIDE.md |
| URL sync, filter, sort normalization | URL-SORT-FILTER-GUIDE.md |
| Zustand stores and usage rules | STATE-MANAGEMENT.md |

## Module Files
| Module | File |
|---|---|
| Account | modules/ACCOUNT.md |
| Activity Logs | modules/ACTIVITY-LOGS.md |
| Auth | modules/AUTH.md |
| Common Components | modules/COMMON.md |
| Customers | modules/CUSTOMERS.md |
| Dashboard | modules/DASHBOARD.md |
| Docman Jobs | modules/DOCMAN-JOBS.md |
| Global Search | modules/GLOBAL-SEARCH.md |
| Layout | modules/LAYOUT.md |
| Leads | modules/LEADS.md |
| Order Details | modules/ORDER-DETAILS.md |
| Orders Table / Orders | modules/ORDERS.md |
| Prescriptions | modules/PRESCRIPTIONS.md |
| Site Settings | modules/SITE-SETTINGS.md |
| Surveys | modules/SURVEYS.md |
| Users | modules/USERS.md |

## Update Rules
- Update PROJECT-STATE.md after non-trivial frontend changes.
- Ensure all new or refactored source code in `src/` follows the **< 100-150 LOC** target rule.
- Update the related module file when changing API params, hooks, tables, or business rules.
- If sort/filter behavior changes, update URL-SORT-FILTER-GUIDE.md and GOTCHAS.md.
- If auth rules or protected routes change, update AUTH-MIDDLEWARE-GUIDE.md.
