# 01. Mandatory Session Workflow & Testing Guidelines

## ⛔ MANDATORY SESSION START — READ BEFORE ANYTHING ELSE

**Every session, before writing a single line of code, you MUST do ALL of the following steps in order:**

### Step 1 — Understand the task domain
Identify which module is being touched (orders, customers, surveys, leads, prescriptions, etc.) and which layers are involved (API service, React component, Next.js page/route, Zustand store, utility).

### Step 2 — Read feature-specific knowledge first (mandatory)
Before touching code, read the frontend knowledge files relevant to the feature:
- `knowledge/PROJECT-STATE.md`
- `knowledge/INDEX.md`
- The matching module file in `knowledge/modules/` (for example: `knowledge/modules/ORDERS.md`, `knowledge/modules/CUSTOMERS.md`, `knowledge/modules/SURVEYS.md`)
- Any matching guide file (for example: `knowledge/URL-SORT-FILTER-GUIDE.md`, `knowledge/API-CLIENT-GUIDE.md`, `knowledge/AUTH-MIDDLEWARE-GUIDE.md`, `knowledge/TESTING_GUIDE.md`)

### Step 3 — Read the relevant code files
Before writing any code, read:
- The target component/hook file
- The API service file it uses (`src/api/services/`)
- The type definitions in `src/types/` for the relevant domain
- Any shared utilities referenced (e.g. `src/utils/url/`)

### Step 4 — Confirm before proceeding
Briefly state: what files will be changed, what layer is affected, and any known gotchas for that module. Then proceed.

Skipping these steps causes mismatched API params, wrong sort defaults, and duplicated logic that already exists elsewhere.

---

## 🛑 MANDATORY SESSION END — BEFORE YIELDING BACK TO THE USER

After completing any non-trivial change:
- Update knowledge files before commit (mandatory):
  - `knowledge/PROJECT-STATE.md` (recent work, focus shifts, risks)
  - Relevant `knowledge/modules/<MODULE>.md` for changed behavior
  - Relevant guide file if architecture or patterns changed
- If a new API param mapping was added, note it (it may need a backend equivalent)
- If a sort/filter field was changed, verify `normalizeSortOrder()` is used
- If a new page was added, check `src/proxy.ts` (Next.js 16 proxy) covers its auth protection
- Run tests before commit (mandatory):
  - At minimum run targeted tests for changed/new code
  - For non-trivial or cross-module changes, run full `npm test`

---

## 🧪 MANDATORY: Write Tests for Every New Feature

Every new feature or code path MUST have tests in the same session. Do not defer.

What counts as required test coverage:
- New service method
- New hook behavior
- New utility function
- New API parameter builder or mapping logic
- New component behavior with branching logic
- New filter/sort/pagination behavior

### Test file locations
| What | Where |
|------|-------|
| API service function | `src/api/services/<name>.test.ts` |
| React hook | `src/components/<module>/hooks/__tests__/<hook>.test.ts` |
| Utility function | alongside the utility or in `src/test/` |

### Minimum coverage required

| Feature type | Minimum tests |
|-------------|---------------|
| API service function | 1 success path + 1 error/empty path |
| React hook | 1 success path + filter/sort edge case |
| Utility (param builder, parser) | 1 valid input + 1 edge/empty input |

### How to run tests
```bash
npm test                          # run all tests once
npm test -- --watch               # watch mode
npm test -- --reporter=verbose    # verbose output
npm test -- <filename>            # run a single file
```

### Test framework
- **Vitest** + **jsdom** + **@testing-library/react**
- Setup file: `src/test/setup.ts` (imports `@testing-library/jest-dom`)
- Mock `apiClient` with `vi.mock('@/api/apiClient', ...)`
- Path alias `@/` maps to `src/` (configured in `vitest.config.ts`)
