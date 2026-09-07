# 1. Overview & Architecture Decisions

**Project:** MediPulse — Survey Builder & Lead Management Module  
**Version:** 1.0 | **Date:** April 14, 2026 | **Status:** Implemented

---

## Overview

This module extends the existing multi-tenant MediPulse admin portal with:

- **Survey Builder** — No-code drag-and-drop survey creation powered by SurveyJS Creator
- **Survey Distribution** — Admin sends personalised survey links to individual customers (from the Order Details page or Customer Profile page), generating a unique per-session token
- **Survey Renderer** — A public-facing page where customers fill in and submit surveys (no login required)
- **Partial Save / Resume** — Customer progress is auto-saved on each survey page change and via an explicit "Save & Continue Later" button; returning to the same link resumes from saved position
- **Response Management** — Admin views, searches, filters, and exports all submissions
- **CRM / Lead Management** — A Lead is automatically created for every survey submission; admins update status, assign to team members, and add notes

### Naming Convention
> [!NOTE]
> The word **Survey** (not "Form") is strictly used throughout this entire module — in the UI components, API routes, database models, and TypeScript types — to prevent naming collisions with existing portal concepts.

### Multi-tenant Context
Every resource and operation is strictly scoped to a `siteId`. The frontend `apiClient` automatically injects `X-SITE-ID`, `X-SITE-KEY`, and `X-SITE-HOST` headers on all authenticated requests. All backend database operations must filter by `siteId`.

---

## Architecture Decisions

| Area / Decision | Technical Choice | Rationale & Implementation Details |
|---|---|---|
| **Customer Identification** | Unique session token per send | No email/identity fields required in the survey form. The customer is already registered; the unique token is directly tied to their customer record. |
| **Token Delivery** | Automated Email via Notification System | Follows the proven Video Consultation pattern (`/video/create-room/:orderId`) — Admin triggers send → Backend generates unique token URL → Notification service emails the customer. |
| **Partial Save & Resume** | Auto-save on page change + "Save & Continue Later" | Auto-save prevents data loss on accidental browser closes; the explicit button provides clarity and peace of mind to the user. |
| **Session Expiry** | 7 days (default, configurable per survey) | Maintains a balance between data security and customer convenience. Configurable in `SurveySettings`. |
| **Lead Generation** | 100% Automatic on submission | Every completed survey response represents a high-intent business signal; instantly creates a CRM lead in `new` status. |
| **Admin Role Gating** | Restricted to `admin` & `super_admin` | Re-uses and activates the existing `role?: string[]` attribute in `NavItem` to secure routes and sidebar menus. |
| **Token Placement** | `X-Survey-Token` request header | Keeps URLs clean, avoids query parameter leakage in logs, and aligns with standard `X-SITE-*` header conventions. |
| **Public Survey URL** | `/s/:token` | Short, opaque, and privacy-first (no PII like names or emails exposed in the URL). |
| **Send Survey Triggers** | 1. Order Details (`CommunicationActionsGrid`)<br>2. Customer Profile (Row Actions) | Mirrors standard portal workflows; reuses a single unified `SendSurveyModal` component across both locations. |

---

## Key Concepts

### 1. Survey
A configurable questionnaire with a **SurveyJS JSON schema**, a `draft`/`published` status, full version history, and per-survey settings (expiry, CAPTCHA, domain restrictions).

### 2. Survey Session
The central record linking **one customer** to **one survey send**. It owns the unique token, partial save data, and final submission.

```
Admin sends survey to Customer
        │
        ▼
SurveySession created
  surveyId / customerId / orderId?
  token: "a8f3k2m9n1..." (32-char random, unique)
  status: "pending"
  expiresAt: now + 7 days
        │
        ▼ (backend emails link: https://<host>/s/<token>)
Customer opens /s/a8f3k2m9n1...
        │
        ▼
  status → "in_progress"
  partialResponse updated on auto/manual save
        │
        ▼ (customer submits)
  status → "completed"
  submittedResponse: { /* full SurveyJS result */ }
        │
        ▼ (automatic, atomic)
Lead created → status: "new"
```

### 3. Lead
Auto-created on every submission. Progresses through: `new → contacted → qualified → closed / lost`.
