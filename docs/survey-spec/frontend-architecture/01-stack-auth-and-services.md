# 4.1 - 4.4 Frontend Architecture: Stack, Auth & Services

## 4.1 Tech Stack & Packages

- **Frameworks:** Astro 5, React 18
- **State & Data Fetching:** TanStack Query v5, Zustand
- **Tables & UI:** TanStack Table, Tailwind CSS v4
- **Survey Engine:** SurveyJS (`survey-creator-react`, `survey-react-ui`, `survey-core`)

---

## 4.2 Sidebar Role Gating

**`SidebarGroup.tsx`** — Added `effectiveRole` prop:
```ts
const isAllowed = (item: NavItem) =>
  !item.role || item.role.includes(effectiveRole);
```

**`Sidebar.tsx`** — Reads `effectiveRole` from `useUserStore` and passes it to `SidebarGroup`.

**`constants.ts`** — Nav items with `role: ['admin', 'super_admin']`:
```ts
{ title: 'Surveys', path: '/surveys', icon: FileText, role: ['admin', 'super_admin'] }
{ title: 'Leads / CRM', path: '/leads', icon: UserCheck, role: ['admin', 'super_admin'] }
```

---

## 4.3 Middleware (`src/middleware.ts`)

- Added to protected admin routes: `/surveys`, `/leads`  
- Added to public customer routes: `/s` (public survey fill page)

---

## 4.4 API Services

### **`src/api/services/surveyService.ts`**
Uses existing `apiClient` (injects `Authorization`, `X-SITE-ID`, etc.):
- `getSurveys`, `getSurveyStats`, `getSurvey`, `createSurvey`, `updateSurvey`, `deleteSurvey`
- `publishSurvey`, `unpublishSurvey`, `duplicateSurvey`
- `getSurveyVersions`, `getSurveyVersion`, `rollbackSurvey`, `updateSurveySettings`
- `sendSurveyToCustomer`, `getSurveySessions`, `getSurveyResponses`, `getSurveyResponse`, `deleteSurveyResponse`, `exportSurveyResponses`, `getAllSurveyResponses`

### **`src/api/services/publicSurveyService.ts`**
Uses plain `axios.create()` — **no admin auth headers**:
- `getSurveySession(token)`
- `saveProgress(token, data)`
- `submitSurvey(token, data)`
*Token sent via `X-Survey-Token` header on every public call.*

### **`src/api/services/leadService.ts`**
Uses `apiClient`:
- `getLeads`, `getLeadStats`, `getLead`, `updateLead`, `updateLeadStatus`, `assignLead`, `getLeadNotes`, `addLeadNote`, `getLeadActivity`
