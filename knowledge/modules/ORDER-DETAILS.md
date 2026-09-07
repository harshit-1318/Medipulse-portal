# Module: Order Details

## Scope
- Detailed order view, per-section actions, and order-linked modals.

## Main Locations
- Components: src/components/order-details/
- API service: src/api/services/orderService.ts

## Notes
- Validate feature-flag or temporary-hidden actions are documented before release toggles change.
- Keep date formatting and status rendering deterministic for medical audit use cases.
- **Communication panel actions are now activity-logged** (May 1 2026):
	- Every button in the Communication section writes to the activity log on success.
	- Handled in `src/components/order-details/hooks/useCommunicationActions.ts` via `logActivity()` (from `src/api/services/activity-log/service.ts`).
	- `action_type` values: `video_consultation_sent`, `in_person_video_consultation_sent`, `prescription_reminder_sent`, `document_reminder_sent`, `customer_message_sent`, `gp_email_sent`, `six_month_review_sent`.
	- `view: 'order_details'`, `object_guid: order.orderInfo.orderId`, user fields from `useUserStore`.
	- Email-customer and GP-email modal flows log after the modal send confirms (via `handleSendMessage` / `handleSendGpEmail`), not when the popup opens.
	- Errors in `logActivity` are swallowed — they never block the action or show an error to the user.
- Bottom `Re-Sync from Shopify` control in view-order now allows `prescriber` role in addition to admin/super_admin/pharmacist/customer_support:
	- Frontend gate: `canResync` in `src/components/order-details/sections/OrderDetailsMainContent.tsx`.
	- Backend endpoint gate already matches this expectation: `POST /orders/:id/resync-shopify` uses `@Roles(...ROLE_GROUPS.ALL_MEDICAL)`, and `ALL_MEDICAL` includes `prescriber`.
	- Guarded by targeted tests in `OrderDetailsMainContent.test.tsx` (prescriber visible, non-medical user hidden).
- DOB rendering in Contact Card now follows backend-first mapping:
	- `normalizeCustomerInfo` prefers `response.customerInfo.dob`.
	- Consultation-question extraction is fallback only when `customerInfo.dob` is missing.
	- This keeps DOB aligned with Shopify customer metafield sync (`custom.date_of_birth`) from backend order-details payload.
- Consultation questions in Order Details are now split into three fixed groups rendered in guaranteed order:
	1. **Default** — all questions that are not GP or Re-Order related (no section header).
	2. **GP Information** — questions whose raw name contains `gp ` or starts with `gp_`.
	3. **Re-Order Information** — questions matching: `reorder`, `side effect`, `side_effect`, `changed since`, or exact `change`.
	- **Re-Order group is only rendered when `repeatedOrders > 0`** (i.e. the customer has placed more than one order). First-order consultations never show the Re-Order section.
	- `repeatedOrders` is sourced from `order.repeatedOrders` (already in normalized order data via `dataNormalization.ts`) and threaded down: `OrderDetailsMainContent` → `ConsultationSection` → `ConsultationQuestions`.
	- Grouping is done by partitioning `filtered` into three arrays upfront before rendering, so the order is fixed regardless of how questions arrive from the backend.
	- Implemented in `src/components/order-details/sections/Consultation/ConsultationQuestions.tsx`.
	- `renderRow()` and `renderGroupHeader()` helpers extracted to avoid repeated JSX blocks.
- Consultation tabs in Order Details now render only for clinical products:
	- filtering is applied in `src/components/order-details/sections/Consultation/ConsultationSection.tsx` using `isClinicalProduct` from `src/components/order-details/utils/order.ts`.
	- add-ons/non-clinical items (for example vitamins, multivitamins, needles) are excluded from tab buttons.
	- if no clinical products are present, tabs are hidden and the existing consultation empty state remains visible.
	- Mounjaro-first ordering is preserved inside the filtered clinical tab set.
- Targeted coverage for this behavior:
	- `src/components/order-details/sections/Consultation/ConsultationSection.test.tsx`
	- `src/components/order-details/utils/order.test.ts`
- BMI assessment is now ethnicity-aware based on consultation answers:
	- Profile detection is implemented in `src/components/order-details/sections/bmi/bmiProfile.ts`.
	- Ethnicity presence detection is implemented via `hasProvidedEthnicityAnswer` to distinguish missing answers from explicit standard-category answers.
	- Classification thresholds are implemented in `src/components/order-details/sections/bmi/useBmiStatus.ts`.
	- UI wiring happens in `src/components/order-details/sections/BmiAssessmentSection.tsx`.
	- Gauge rendering/colors are in `src/components/order-details/sections/bmi/BmiGauge.tsx`.
	- Gauge pointer is a lightweight stickman that scales body thickness smoothly with BMI (thinner at lower BMI, fuller at higher BMI).
	- Pointer placement is computed from the gauge segment geometry (not static percentages) to keep the stickman inside the correct zone color for the current BMI bucket.
	- Stickman pointer is intentionally rendered above the gauge bar to avoid overlap with threshold labels.
	- Threshold labels are aligned to zone centers instead of equal spacing so each label sits under its correct segment.
	- BMI status badge styling is zone-driven and intentionally mirrors the exact active gauge segment color family (including fuchsia for standard-profile severe obesity).
	- BMI gauge shows a staff-facing note when ethnicity is missing: "Using standard BMI thresholds (ethnicity not provided)."
	- Website ethnicity options (e.g., Asian or Asian British, Black/African/Caribbean/Black British, Middle Eastern, Mixed with listed backgrounds) map to lower-threshold BMI profile.
	- White/Other/Prefer not to say keep standard profile.
	- Targeted coverage for gauge visuals and threshold behavior is in `src/components/order-details/sections/bmi/BmiGauge.test.tsx`.
- `useVideoRecordings` now includes gated `[VIDEO_DEBUG]` logs for intermittent failures:
	- logs start/response/mapped/fallback phases,
	- includes order id and recording counts,
	- enabled in dev or by setting `localStorage.DEBUG_VIDEO_RECORDINGS = 'true'`.
- `useVideoRecordings` also sends cache-busting `_ts` query param + no-cache headers for `/video/recordings/by-order/:orderId` to reduce stale 304 revalidation during modal opens.
- Auto re-sync trigger on order details load is env-gated:
	- implemented in `src/components/order-details/sections/OrderDetailsMainContent.tsx`.
	- runs only when `VITE_AUTO_RESYNC=true` (or `PUBLIC_AUTO_RESYNC=true`, or `AUTO_RESYNC=true` legacy fallback).
	- still requires missing backend `resynced_at` signal (mapped to `orderInfo.resyncedAt`) before calling re-sync.
	- env parsing/debug toggles use shared utility `src/utils/env.ts`.
	- covered by `src/components/order-details/sections/OrderDetailsMainContent.test.tsx`.
	- Apr 28 2026 deployment gotcha: when `[AUTO_RESYNC_DEBUG]` shows `autoResyncEnv: undefined`, do not assume code is broken. First verify you set flags on the app serving the tested domain (example mismatch: set on staging app A while testing `staging.medipulse.co.uk`, which uses `medipulse-frontend-staging`).
	- Operational rule: keep `PUBLIC_AUTO_RESYNC=true` on the active frontend app; keep `VITE_AUTO_RESYNC=true` as compatibility fallback.
- "Reorder Order ID" consultation question now renders as a clickable link in the Re-Order Information section:
	- Implemented in `src/components/order-details/sections/Consultation/ConsultationQuestions.tsx` via `isReorderOrderId()` helper.
	- Matches question name `"Reorder Order ID"` case-insensitively, collapsing spaces/underscores (e.g., `reorder order id`, `reorder_order_id`).
	- Renders as an `<a>` pointing to `/orders/view/{orderId}` with `target="_blank"` and `rel="noopener noreferrer"`.
	- Styled consistently with the `badge-neutral` badge family, includes an external-link icon (mini SVG).
	- All other Re-Order group questions are unaffected.
- Re-order BMI / Clinical Measurements section enhancements (Apr 29 2026):
	- `ConsultationSection.tsx` renders a **BMI delta badge** below the current gauge on re-orders only: `▲ +N.NN` in red / `▼ -N.NN` in green / `= 0` in grey. Badge is `text-sm font-bold px-4 py-2 rounded-xl border` — visually prominent.
	- Section label renamed from "Clinical Measurements" → "Current Clinical Measurements".
	- Previous Consultation Measurements block now wrapped in a muted card (`rounded-2xl border border-slate-200 bg-slate-50/60 p-4`) to visually distinguish it from the current measurements block. Title text is dimmed; divider opacity reduced.
	- `getPrevBmiDisplay` falls back to calculating BMI from `prevHeightData` + `prevWeightData` when no explicit `prevBmiData` is stored (covers current Shopify re-order format).
- Module Architecture & Barrel Standardization (Sep 2026):
	- Standardized symmetrical barrel hierarchy across all subfolders: added `index.ts` files to `components/`, `components/VideoPlayer/`, and section subdirectories (`ActivityLogs/components`, `bmi/components`, `bmi/hooks`, `bmi/utils`, `Communication/components`, `Consultation/components`, `Consultation/hooks`, `DocumentPrescription/components`, `DocumentPrescription/hooks`, `Header/components`, `InfoCards/components`, `InternalNotes/components`, `SCR/components`).
	- Re-exported `components/` from root `src/components/order-details/index.ts` with `VideoPlayer` namespaced to prevent name collision with `sections/InfoCards`.
	- Extracted nested sub-interfaces from `src/components/order-details/types/api.ts` into `types/models.ts`, shrinking `api.ts` from 140 to 55 LOC.
	- Extracted `useConsultationMeasurements` hook from `ConsultationSection.tsx`, reducing file length from 113 to 84 LOC.
	- 100% of non-test source files in `src/components/order-details/` strictly adhere to < 100 LOC.
	- Added 4 dedicated unit test suites in `__tests__/components/` (`ActionButton.test.tsx`, `DocumentRow.test.tsx`, `Row.test.tsx`, `VideoRecordingsTable.test.tsx`), bringing module test total to 24 files and 231 passing tests.
	- Reorganized `hooks/` from a flat 15-file directory into 5 domain subfolders (`clinical/`, `communication/`, `media/`, `order/`, `resync/`), each with a dedicated `index.ts` barrel, unified under root `hooks/index.ts` for clean developer ergonomics.
	- Reorganized `modals/` from a flat 11-file directory into 4 domain subfolders (`communication/`, `decline/`, `feedback/`, `media/`) alongside `OrderDetailsModals.tsx` and root `modals/index.ts`.
