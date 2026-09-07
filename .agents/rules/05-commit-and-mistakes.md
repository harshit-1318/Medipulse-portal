# 05. Common Mistakes Checklist & Commit Standards

## 🚨 Common Mistakes to Avoid

| Mistake | Impact | Fix |
|---------|--------|-----|
| Using raw `axios` instead of `apiClient` | Missing site headers, no global loader | Always use `apiClient` from `src/api/apiClient.ts` |
| Not normalizing sort direction | Backend receives `'ascending'` and breaks | Always use `normalizeSortOrder(filters.sort)` |
| Breaking the dual-endpoint customer logic | Wrong endpoint called, wrong data shape | Read `customer/index.ts` before changing customer API calls |
| Manually adding site headers to a request | Duplicated headers, fragile | Let the interceptor handle it — never pass site headers manually |
| Forgetting `isInitialLoad` ref in new page hooks | Infinite re-fetches or wrong endpoint on first load | Use `useRef(true)` pattern from `useCustomersPage.ts` |
| Adding a new protected page without updating `middleware.ts` | Page accessible without auth | Add path prefix to `protectedRoutes` array in `src/middleware.ts` |
| Hard-coding sort field names in the component | Diverges from backend field names over time | Keep sort mapping in the param builder (`buildParams.ts` / `utils.ts`) |

---

## ✅ Pre-Commit Checklist

- [ ] All API calls use `apiClient` — never raw `axios`
- [ ] Sort direction always passes through `normalizeSortOrder()`
- [ ] Sort field names mapped to backend names in param builder
- [ ] New protected pages added to `protectedRoutes` in `middleware.ts`
- [ ] New feature has tests — at minimum 1 success + 1 error/edge path
- [ ] New or modified source components/hooks in `src/` respect the **< 100-150 LOC** target rule
- [ ] Tests pass: `npm test`
- [ ] No console warnings about missing site headers in dev

---

## 📝 Commit Message Format (Mandatory)

```
<type>(<scope>): <short summary>

WHAT:
- bullet points with exact changes

WHY:
- bullet points with problem/risk/root cause

HOW:
- bullet points with implementation approach

BENEFITS:
- bullet points with concrete outcomes
```

**Type prefixes**: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`, `perf`  
**Scope examples**: `customers`, `orders`, `surveys`, `auth`, `api-client`, `filters`
