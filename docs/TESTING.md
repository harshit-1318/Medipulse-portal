# Testing & Quality Assurance Guide — MediPulse Portal

## 1. Test Suite Overview
`MediPulse Portal` maintains a comprehensive Vitest unit and component regression test suite covering all services, business logic mappers, UI components, custom hooks, and stores.

```text
Test Execution Summary:
---------------------------------------------
Test Files : 64 passed (64 total)
Tests      : 482 passed (482 total)
Environment: Vitest 4.0.18 + JSDOM 28 + RTL 16
```

---

## 2. Test Execution Commands

```bash
# Run all Vitest unit and component tests
npm test

# Run tests in watch mode
npx vitest

# Run tests with UI coverage reporter
npx vitest --ui
```

---

## 3. Test File Directory Map (64 Files)

- **API Services & Data Mappers:**  
  `activity-log.test.ts`, `customer/utils.test.ts`, `emailQueueService.test.ts`, `globalSearchService.test.ts`, `leadService.test.ts`, `publicSurveyService.test.ts`, `superAdminService.test.ts`, `surveyService.test.ts`, `consultationActions.test.ts`, `order.test.ts`, `date.test.ts`, `mapper.test.ts`, `products.test.ts`, `status.test.ts`, `unauthorized.test.ts`.

- **Order Details & BMI Components:**  
  `OrderDetailsPage.test.tsx`, `CommunicationActionsGrid.test.tsx`, `OrderDetailsMainContent.test.tsx`, `BmiGauge.test.tsx`, `bmiProfile.test.ts`, `BmiQuestions.test.tsx`, `ConsultationSection.test.tsx`, `IdentityCard.test.tsx`, `ContactCard.test.tsx`, `CustomerCard.test.tsx`, `InternalNoteInput.test.tsx`, `address.test.ts`, `communication.test.ts`, `consultation.test.ts`, `customerNormalization.test.ts`, `dataNormalization.test.ts`, `measurement.test.ts`, `order.test.ts`.

- **Orders Table & Filters:**  
  `UrgentOrdersContent.test.tsx`, `DocsCell.test.tsx`, `ActiveFilterChips.test.tsx`, `options.test.ts`, `OrderFiltersForm.test.tsx`, `useOrderFilters.test.ts`, `useUrgentOrdersData.test.ts`.

- **Auth, Layout & Users:**  
  `IdleSessionManager.test.tsx`, `LoginForm.actions.test.tsx`, `LoginForm.render.test.tsx`, `LoginForm.test.tsx`, `Logo.test.tsx`, `EmailQueueMonitorPage.test.tsx`, `Sidebar.test.tsx`, `SidebarGroup.test.tsx`, `SidebarLogo.test.tsx`, `SidebarNavItem.test.tsx`, `UserRow.test.tsx`, `PasswordFields.test.tsx`.

- **Utilities & Helpers:**  
  `authRedirect.test.ts`, `env.test.ts`, `favicon.test.ts`, `normalizeCustomer.test.ts`, `filterConstants.test.ts`, `useActivityFilters.test.ts`, `ActivityTableBody.test.tsx`, `ActivityFiltersModal.test.tsx`, `LeadStatusBadge.test.tsx`, `SurveyStatusBadge.test.tsx`, `useSurveyFilters.test.ts`.
