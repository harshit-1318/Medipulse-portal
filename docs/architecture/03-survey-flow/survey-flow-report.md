# MediPulse Healthcare Portal — SurveyJS & Clinical Lead Intake Architecture Report

**Document Version:** 1.0.0  
**Domain Scope:** Clinical Questionnaires, Patient Intake, Survey Creator, Lead Ingestion Pipeline  
**Framework Baseline:** Next.js 16 App Router · SurveyJS (survey-core / survey-creator-react) · React 19 · MongoDB Atlas  

---

## 1. Executive Summary

The SurveyJS and Clinical Lead Intake platform allows clinical administrators to author, customize, and publish medical consultation assessments (e.g. GLP-1 weight loss evaluation, diabetes screening, telemedicine questionnaires) using **SurveyJS Creator**.

When prospective patients complete surveys via public slugs (`/s/:slug`), responses are securely parsed and ingested into the `leads` collection, establishing a direct pipeline into the clinical order and prescription system.

---

## 2. Ingestion & Conversion Architecture

```
[Admin Survey Creator] ──► [POST /api/surveys] ────────► [MongoDB Survey Model]
                                                                │
[Patient Completes /s/:slug] ◄── [Public Survey Viewer] ◄──────┘
         │
         ▼
[POST /api/surveys/responses] ──► [Lead Pipeline] ─────► [MongoDB Lead Model]
                                                                │
                                                                ▼
                                                        [Customer Conversion]
```

### Step 1: Clinical Survey Authoring
- **Location:** `src/app/(dashboard)/surveys/page.tsx`
- Integrates `survey-creator-react` and `survey-core`.
- Clinicians design questions with dynamic visibility rules (e.g., if BMI > 30, display GLP-1 qualification questions).
- JSON schema output includes `pages`, `elements` (text, radiogroup, checkbox, dropdown), and validation expressions.

### Step 2: Survey Persistence (`POST /api/surveys`)
- **File:** [`src/app/api/surveys/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/surveys/route.ts)
- Persists survey payload to MongoDB collection `surveys` ([`src/lib/db/models/Survey.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/models/Survey.ts)) with:
  - `title`, `description`, `slug`
  - `schema` (JSON schema object)
  - `status`: `draft` | `published` | `archived`
  - `currentVersion`: number

### Step 3: Public Questionnaire Delivery (`/s/:slug`)
- **Location:** `src/app/(public)/s/[slug]/page.tsx`
- Rendered via `survey-react-ui`.
- Standalone patient experience (no admin sidebar/navigation).
- Auto-fetches active survey schema based on slug and initializes theme.

### Step 4: Patient Submission & Lead Ingestion
- When patient finishes questions, the `onComplete` hook dispatches the answer payload.
- Ingestion engine extracts patient contact info (`customerName`, `customerEmail`, `customerPhone`) and medical history.
- Inserts new record into MongoDB `leads` collection with `status: 'new'` and initial assessment notes.

### Step 5: Clinical Lead Management (`GET /api/leads`)
- **File:** [`src/app/api/leads/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/leads/route.ts)
- Clinicians view incoming patient inquiries at `/leads`.
- Supports filtering by status (`new`, `contacted`, `qualified`, `converted`) and search across patient names and emails.
- Converting a qualified lead automatically provisions a clinical `Customer` profile and draft `Order`.

---

## 3. Verified File Map

| Component / Function | File Path | Line Range | Architectural Responsibility |
| :--- | :--- | :---: | :--- |
| **Surveys Dashboard** | `src/app/(dashboard)/surveys/page.tsx` | L1-40 | Survey list and creator launcher |
| **POST /api/surveys** | `src/app/api/surveys/route.ts` | L67-98 | Creates and saves survey schemas |
| **Survey Model** | `src/lib/db/models/Survey.ts` | L1-50 | Mongoose schema for survey configurations |
| **GET /api/leads** | `src/app/api/leads/route.ts` | L5-79 | Fetches and filters patient lead pipeline |
| **Lead Model** | `src/lib/db/models/Lead.ts` | L1-45 | Schema for patient inquiries and triage status |
