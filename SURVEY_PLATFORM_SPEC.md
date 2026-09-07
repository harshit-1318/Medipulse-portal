# Survey Builder & CRM Platform — Technical Specification

**Project:** MediPulse — Survey Builder & Lead Management Module  
**Version:** 1.0 | **Date:** April 14, 2026 | **Status:** Implemented

> 💡 **Notice:** This document has been split into smaller, dedicated modular documentation files for better readability and maintenance. You can navigate to individual modules below:

---

## 📁 Specification Index

- 📘 [**01. Overview & Architecture Decisions**](docs/survey-spec/01-overview-and-architecture.md)
  - Overview, Naming Conventions, Multi-tenant Context, Key Concepts (Survey, Session, Lead).

- 🗄️ [**02. Database Schema (MongoDB)**](docs/survey-spec/02-database-schema.md)
  - Full collection definitions and indexes for `surveys`, `survey_versions`, `survey_sessions`, and `leads`.

- ⚡ [**03. API Specification & Quick Reference**](docs/survey-spec/03-api-specification.md)
  - Complete REST API endpoints (Admin Survey Management, Public Fill, Responses, Lead CRM, and Quick Reference table).

- 🎨 [**04. Frontend Architecture (React / Astro)**](docs/survey-spec/04-frontend-architecture.md)
  - Tech stack, Role Gating, API Service files, TypeScript interfaces, Astro Pages, and React Component Tree.

- 🔒 [**05. SurveyJS Integration & Security**](docs/survey-spec/05-surveyjs-and-security.md)
  - CSS isolation guidelines, SSR avoidance for SurveyJS Creator, token security, and rate limiting.

- ✅ [**06. Acceptance Criteria**](docs/survey-spec/06-acceptance-criteria.md)
  - Step-by-step checklist to verify feature completion across all modules.

---

📂 All sub-documents are stored in: [`docs/survey-spec/`](docs/survey-spec/README.md)
