# Module: Surveys

## Scope
- Survey builder, survey listing, and survey-related lead/customer flows.

## Main Locations
- Components: src/components/surveys/
- Pages: src/pages/surveys/
- API services: src/api/services/surveyService.ts and src/api/services/publicSurveyService.ts

## Notes
- Keep survey public/private endpoint boundaries explicit.
- Test schema/shape transformations for survey payloads before release.
- UI aligns with Orders Filters design system: clean single `h1` header and 14px uppercase column headers.
- **Survey Responses Shape Normalization**: Responses API payloads support both nested objects (`customer: { name, email }`, `survey: { title }`) and flat fields (`customerName`, `customerEmail`, `surveyTitle`). Frontend components (`SurveyResponseRow`, `ResponseMetaSections`, `SurveyResponseDetail`) must always use optional chaining and defensive fallbacks to prevent `Cannot read properties of undefined` runtime crashes.
- **Error Boundaries**: Route-level error boundaries are placed at `src/app/(dashboard)/surveys/error.tsx` and `src/app/(dashboard)/surveys/responses/error.tsx` to prevent uncaught render exceptions from unmounting the app layout.
