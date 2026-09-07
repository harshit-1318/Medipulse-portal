# MediPulse Portal — Modern Enterprise Healthcare Admin Portal

![Next.js 16](https://img.shields.io/badge/Next.js-16.0.0-black)
![React 19.2](https://img.shields.io/badge/React-19.2.4-blue)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.2-38bdf8)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154)
![Vitest](https://img.shields.io/badge/Vitest-Passing_91/91-729b1b)

`MediPulse Portal` is an enterprise-grade healthcare management, medical prescription audit, survey builder, and multi-tenant admin portal built with Next.js 16, React 19.2, TypeScript 5, Tailwind CSS 4, and TanStack Query. It connects directly to a production NestJS backend.

---

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Target Technology Stack](#target-technology-stack)
- [Quick Start & Setup](#quick-start--setup)
- [Environment Configuration](#environment-configuration)
- [Project Directory Structure](#project-directory-structure)
- [Key Features & Business Rules](#key-features--business-rules)
- [Documentation Index](#documentation-index)
- [Testing & Quality Assurance](#testing--quality-assurance)

---

## Architecture Overview

`MediPulse Portal` utilizes Next.js 16 App Router for hybrid Server Component rendering and interactive client state boundaries:

```text
Browser Client
   │
   ▼
Next.js 16 Edge Middleware (middleware.ts)
   ├── Token Authorization & Expiry Check
   ├── Role Routing (super_admin vs prescriber/admin)
   └── Return URL Path Restoration
   │
   ▼
App Router Layouts & Pages (src/app/)
   ├── Centralized Typed API Client (src/lib/api/client.ts)
   │     ├── Bearer Token Injection
   │     └── Multi-Tenant Headers (X-SITE-ID, X-SITE-KEY, X-SITE-HOST)
   │
   ▼
NestJS Backend API (http://localhost:5000 or your custom backend URL)
```

---

## Target Technology Stack

- **Framework:** Next.js 16.0.0 (App Router)
- **UI Library:** React 19.2.4
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 4.2.1 + CSS Custom Properties
- **Server State:** TanStack React Query v5.90.21
- **Headless Tables:** TanStack React Table v8.21.3
- **Global Client State:** Zustand v5.0.11
- **Icons & Animation:** Lucide React v0.575 / Framer Motion v12
- **Survey Engine:** SurveyJS v2.5.20 (`survey-core`, `survey-creator-react`)
- **HTTP Client:** Axios v1.13.5 (Centralized wrapper)
- **Testing Engine:** Vitest v4.0.18 + React Testing Library v16

---

## Quick Start & Setup

### Prerequisites
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

### Installation
```bash
# Install dependencies
npm install
```

### Running Locally
```bash
# Start local development server (http://localhost:3000)
npm run dev
```

### Building for Production
```bash
# Next.js production build
npm run build

# Start production server
npm run start
```

### Running Typechecks & Tests
```bash
# TypeScript compiler check
npm run typecheck

# Execute Vitest test suite (64 test files, 482 tests)
npm test
```

---

## Environment Configuration

Environment configuration files are categorized by deployment tier:

| Environment File | Purpose |
|---|---|
| `.env.local` | Local development environment settings (Connected to production Heroku API). |
| `.env.development` | Development deployment configuration. |
| `.env.production` | Production deployment configuration. |
| `.env.example` | Template file documenting all required environment variables. |

### Key Environment Variables

```bash
# Custom Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
SERVER_API_BASE_URL=http://localhost:5000

# Multi-Tenant Site Defaults
NEXT_PUBLIC_DEFAULT_SITE_HOST=portal.medipulse.co.uk
NEXT_PUBLIC_SURVEY_TOKEN_HEADER=X-Survey-Token

# Feature Flags
NEXT_PUBLIC_AUTO_RESYNC=true

# Debug Options
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=false
NEXT_PUBLIC_DEBUG_VIDEO_RECORDINGS=false
NEXT_PUBLIC_DEBUG_IDLE_TIMER=false
```

---

## Project Directory Structure

```text
src/
├── app/                              # Next.js 16 App Router Routes
│   ├── (auth)/login/                 # Public Login Route
│   ├── (dashboard)/                  # Authenticated Portal Routes
│   │   ├── layout.tsx                # App Shell Layout (Sidebar, Header)
│   │   ├── dashboard/                # Main Prescriber/Admin Dashboard
│   │   ├── super-dashboard/          # Super Admin Analytics & Sites
│   │   ├── orders/                   # Orders Table & Order Details Pages
│   │   ├── customers/                # Customer Directory
│   │   ├── leads/                    # Survey Auto-Created CRM Leads
│   │   ├── prescriptions/            # Prescription Audit Table
│   │   ├── surveys/                  # SurveyJS Creator & Responses
│   │   ├── users/                    # User Admin & Profile Timeline
│   │   ├── sites/                    # Multi-Tenant Site Configuration
│   │   ├── activity-logs/            # Order-Grouped Audit Logs
│   │   ├── queue-monitor/            # Email Queue Monitor
│   │   ├── docman-jobs/              # Document Generation Jobs
│   │   └── account/                  # User Profile & Security Settings
│   ├── (public)/s/[token]/           # Customer Survey Completion Endpoint
│   ├── (video)/orders/[id]/video/    # Standalone Video Player
│   ├── layout.tsx                    # Root Layout & QueryClientProvider
│   └── globals.css                   # Tailwind v4 import & global styles
│
├── components/                       # Shared UI & Layout Components
│   ├── ui/                           # Base UI primitives
│   ├── layout/                       # Sidebar, Header, Breadcrumbs, Logo
│   ├── order-details/                # BMI Stickman Gauge, Questions, Comms
│   ├── orders-table/                 # Tables, Filters, Category Views
│   ├── surveys/                      # SurveyJS Builder & Renderer
│   ├── super-admin/                  # Activity Analytics Charts
│   └── users/                        # User Forms & Audit Summary
│
├── lib/
│   ├── api/                          # Centralized apiClient.ts
│   └── utils/                        # Data mappers & calculators
│
├── stores/                           # Zustand Stores (userStore, siteStore)
├── types/                            # TypeScript Domain Definitions
└── middleware.ts                     # Next.js Edge Auth & Multi-Site Middleware
```

---

## Documentation Index

Detailed architectural documentation is maintained in the `docs/` folder:

- 📘 [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture, Server/Client component boundaries, and data flow.
- 🛣️ [ROUTES.md](docs/ROUTES.md) — Complete 55-route inventory, parameters, and access permissions.
- 📡 [API-CONTRACTS.md](docs/API-CONTRACTS.md) — NestJS backend API contracts, query parameters, and hooks.
- 🔐 [AUTH.md](docs/AUTH.md) — JWT handling, Edge Middleware, return URL restoration, and hidden-tab idle session timeout.
- 👥 [RBAC.md](docs/RBAC.md) — Role-Based Access Control matrix (`super_admin`, `admin`, `prescriber`, `pharmacist`, `customer_support`).
- 🌐 [MULTI-SITE.md](docs/MULTI-SITE.md) — Domain detection, site headers (`X-SITE-ID`, `X-SITE-KEY`, `X-SITE-HOST`), and dynamic branding.
- ⚡ [STATE-MANAGEMENT.md](docs/STATE-MANAGEMENT.md) — TanStack Query server state, Zustand client stores, and URL state sync.
- 🧪 [TESTING.md](docs/TESTING.md) — Vitest test catalog, mock patterns, and execution guidelines.
- 🚀 [DEPLOYMENT.md](docs/DEPLOYMENT.md) — Environment setup, build verification, and deployment guides.
- 🔄 [MIGRATION.md](docs/MIGRATION.md) — Forensic audit summary and legacy Astro $\rightarrow$ Next.js 16 conversion matrix.

---

## Testing & Quality Assurance

- **Vitest Test Suite:** 64 test files | 482 passing tests.
- **TypeScript Typecheck:** 0 compilation errors (`npx tsc --noEmit`).
- **Production Build:** Next.js Turbopack compiler verified (`npm run build`).
