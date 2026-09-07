# 4.6 & 4.7 Frontend Architecture: Pages, Components & Public Flow

## 4.6 Astro Pages & Component Tree

### Astro Pages
- `src/pages/surveys/index.astro` → `SurveysPage` (Admin)
- `src/pages/surveys/create.astro` → `SurveyBuilderPage` (Admin)
- `src/pages/surveys/[id]/edit.astro` → `SurveyBuilderPage` (Admin)
- `src/pages/surveys/[id]/responses.astro` → `SurveyResponsesPage` (Admin)
- `src/pages/surveys/responses/index.astro` → `SurveyResponsesPage` (All Surveys)
- `src/pages/leads/index.astro` → `LeadsPage` (Admin)
- `src/pages/s/[token].astro` → `PublicSurveyPage` (**Public**)

### React Component Tree
```
src/components/surveys/
├── SurveysPage.tsx               QueryProvider → content with stats + table
├── SurveysHeader.tsx             Title + "Create Survey" button
├── SurveysTable.tsx              TanStack Table: title, status badge, responses, date, actions
├── SurveyStatusBadge.tsx         "Draft" (grey) / "Published" (green) chip
├── SendSurveyModal.tsx           Shared modal: select survey → send; 409 resend flow
├── hooks/
│   ├── useSurveysList.ts         TanStack Query + pagination + filters
│   └── useSurveyFilters.ts       Local filter state + active filter chips
├── builder/
│   ├── SurveyBuilderPage.tsx     Lazy-loads SurveyJS Creator via dynamic import()
│   ├── SurveyBuilderToolbar.tsx  Back nav, title, Save Draft / Publish buttons
│   ├── SurveyVersionHistory.tsx  Drawer: version list + rollback
│   └── hooks/useSurveyBuilder.ts
├── responses/
│   ├── SurveyResponsesPage.tsx   Per-survey and all-surveys mode
│   ├── SurveyResponseDetail.tsx  Modal: read-only SurveyJS renderer for one response
│   └── hooks/useResponsesList.ts
└── public/
    └── PublicSurveyPage.tsx      Customer-facing fill page (auto-save, manual save, resume)

src/components/leads/
├── LeadsPage.tsx                 QueryProvider → content with stats + table
├── LeadStatusBadge.tsx           new=blue / contacted=yellow / qualified=purple / closed=green / lost=red
├── LeadDetailDrawer.tsx          Slide-out drawer: Notes tab / Activity tab / Response tab
└── hooks/
    ├── useLeads.ts               TanStack Query + pagination + filters
    └── useLeadDetail.ts          Single lead detail, status update, assign, add note
```

---

## 4.7 Public Survey Page Behaviour & Integrations

### PublicSurveyPage Flow
1. Mount → call `getSurveySession(token)`
2. `410 alreadySubmitted` → "You've already submitted this survey" screen
3. `410 expired` → "This survey link has expired" screen
4. Otherwise → mount `<Survey model={...}>` with schema
5. Pre-populate answers from `partialResponse`; navigate to `currentPage`
6. **Auto-save**: `onCurrentPageChanged` → `saveProgress(...)`
7. **Explicit save**: "Save & Continue Later" button → same PATCH call
8. **Submission**: `onComplete` → `submitSurvey(...)` → confirmation screen

### "Send Survey" Triggers
- **Order Details Page:** `CommunicationActionsGrid.tsx` — "Send Survey" button.
- **Customer Profile Page:** `CustomerRow.tsx` — clipboard icon in row actions.
