# Project & Directory Structure — MediPulse Portal

**Project:** MediPulse Healthcare Admin Portal  
**Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4

---

## 📁 Visual Directory Tree

```text
medipulse-portal/
├── .agents/                          # Antigravity / Gemini Customization Rules
│   └── rules/                        # Modular Agent Rule Documents
│       ├── 01-mandatory-workflow.md  # Session Start/End & Testing Rules
│       ├── 02-api-and-auth-patterns.md # API Client, JWT Cookies & Site Headers
│       ├── 03-sorting-and-filtering.md # Sort Order Normalization & URL Sync
│       ├── 04-architecture-and-stores.md # Zustand Stores & Folder Rules
│       └── 05-commit-and-mistakes.md # Common Mistakes & Commit Format
│
├── docs/                             # Architecture & Domain Specifications
│   ├── WORKFLOW_AND_ARCHITECTURE.md  # Complete Visual Flowchart & File-to-File Guide
│   ├── ARCHITECTURE.md               # System Data Flow & Component Boundaries
│   ├── ROUTES.md                     # 55-Route Inventory & Permission Matrix
│   ├── API-CONTRACTS.md              # NestJS Backend API Contracts & Services
│   ├── AUTH.md                       # JWT Token Management & Middleware
│   ├── RBAC.md                       # Role-Based Access Control Matrix
│   ├── MULTI-SITE.md                 # Multi-Tenant Site Detection & Headers
│   ├── STATE-MANAGEMENT.md           # TanStack Query Server State & Zustand Stores
│   ├── TESTING.md                    # Vitest Catalog & Testing Guidelines
│   ├── DEPLOYMENT.md                 # Deployment & Environment Configuration
│   ├── MIGRATION.md                  # Legacy Astro → Next.js 16 Conversion Matrix
│   └── survey-spec/                  # Modular Survey Builder & CRM Spec
│       ├── README.md                 # Index of Survey Specs
│       ├── 01-overview-and-architecture.md
│       ├── 02-database-schema.md
│       ├── 03-api-specification.md
│       ├── 04-frontend-architecture.md
│       ├── 05-surveyjs-and-security.md
│       └── 06-acceptance-criteria.md
│
├── knowledge/                        # Feature Module Guides & Developer Reference
│   ├── INDEX.md                      # Knowledge Base Entry Point
│   ├── PROJECT-STATE.md              # Active Tasks & Project Focus Status
│   ├── GOTCHAS.md                    # Common Pitfalls & Fixes
│   ├── API-CLIENT-GUIDE.md           # Shared Axios Interceptors Guide
│   ├── AUTH-MIDDLEWARE-GUIDE.md      # Route Protection & Middleware Guide
│   ├── ENV-VARIABLES-GUIDE.md        # Environment Flags & Debug Toggles
│   ├── TESTING_GUIDE.md              # Vitest Conventions & Mock Patterns
│   ├── URL-SORT-FILTER-GUIDE.md      # URL Sync & Sort Normalization Guide
│   └── modules/                      # Module-Specific Guides
│       ├── ACCOUNT.md
│       ├── ACTIVITY-LOGS.md
│       ├── AUTH.md
│       ├── CUSTOMERS.md
│       ├── DASHBOARD.md
│       ├── DOCMAN-JOBS.md
│       ├── LEADS.md
│       ├── ORDER-DETAILS.md
│       ├── ORDERS.md
│       ├── PRESCRIPTIONS.md
│       ├── SITE-SETTINGS.md
│       ├── SURVEYS.md
│       └── USERS.md
│
├── public/                           # Static Public Assets
│   ├── favicon.svg                   # Browser Favicon
│   ├── logo.png                      # Main Portal Logo
│   ├── logo-icon.png                 # Small Icon Logo
│   └── rxLogo.svg                    # RX Clinic Branding SVG
│
├── src/                              # Main Application Source Code
│   ├── api/                          # Network Layer & API Services
│   │   ├── apiClient.ts              # Centralized Axios Singleton Wrapper
│   │   ├── services/                 # Domain API Services
│   │   │   ├── activity-log/         # Audit Logs API Service
│   │   │   ├── customer/             # Customer Directory & Search Service
│   │   │   ├── globalSearch/         # Global Search Service
│   │   │   ├── orders/               # Orders, Status & Consultation Services
│   │   │   ├── dashboardService.ts   # Prescriber Dashboard Analytics API
│   │   │   ├── emailQueueService.ts  # Email Queue Monitor API
│   │   │   ├── leadService.ts        # CRM Lead Management API
│   │   │   ├── prescriptionService.ts# Prescription Audit API
│   │   │   ├── publicSurveyService.ts# Customer Public Survey Fill API
│   │   │   ├── siteService.ts        # Tenant Site Configuration API
│   │   │   ├── superAdminService.ts # Super Admin Analytics API
│   │   │   ├── surveyService.ts      # Admin Survey Builder API
│   │   │   └── userService.ts        # User Administration API
│   │   └── utils/                    # API Request/Response Helper Utilities
│   │
│   ├── app/                          # Next.js 16 App Router Routes & Layouts
│   │   ├── (auth)/                   # Authentication Routes (Login)
│   │   ├── (dashboard)/              # Protected Portal Routes
│   │   │   ├── account/              # User Profile & Security Settings
│   │   │   ├── activity-logs/        # Audit Trail & Log Viewer
│   │   │   ├── customers/            # Customer Directory
│   │   │   ├── dashboard/            # Main Prescriber Dashboard
│   │   │   ├── docman-jobs/          # Document Generation Job Queue
│   │   │   ├── leads/                # Survey Auto-Generated CRM Leads
│   │   │   ├── orders/               # Orders Management & Order Details View
│   │   │   ├── prescriptions/        # Prescription Audit Grid
│   │   │   ├── queue-monitor/        # Outbound Email Queue Monitor
│   │   │   ├── sites/                # Multi-Tenant Site Manager
│   │   │   ├── super-dashboard/      # Super Admin System Overview
│   │   │   ├── surveys/              # Survey Builder & Responses Grid
│   │   │   └── users/                # Staff User Administration
│   │   ├── (public)/s/[token]/       # Customer Public Survey Fill Endpoint
│   │   ├── (video)/orders/[id]/video/# Video Consultation Player View
│   │   ├── globals.css               # Global Styles & Tailwind CSS v4 Imports
│   │   └── layout.tsx                # Root App Shell Layout & QueryClientProvider
│   │
│   ├── components/                   # Domain-Organized React UI Components
│   │   ├── account/                  # Account Profile Cards & Security Forms
│   │   ├── activity-logs/            # Audit Log Tables & Filter Form
│   │   ├── auth/                     # LoginForm & IdleSessionManager
│   │   ├── common/                   # Shared UI Components (Logo, Badges, Modals)
│   │   ├── customers/                # Customers Table & Customer Profile Drawers
│   │   ├── dashboard/                # Prescriber Stat Cards & Recent Orders
│   │   ├── docman-jobs/              # Job Queue Tables & Status Badges
│   │   ├── email-queue/              # Email Queue Monitor Tables & Retry Modals
│   │   ├── layout/                   # Sidebar, Header, Breadcrumbs & UserMenu
│   │   ├── leads/                    # Lead Table, Detail Drawer & Notes Tabs
│   │   ├── order-details/            # Order Details, BMI Gauge & Comms Actions
│   │   ├── orders-table/             # Orders Data Table, Filters & Views
│   │   ├── prescriptions/            # Prescription Audit Tables & Action Modals
│   │   ├── providers/                # React Query & Theme Context Providers
│   │   ├── site-settings/            # Tenant Site Settings Forms & Credentials
│   │   ├── super-admin/              # Activity Analytics Charts & Site Cards
│   │   ├── surveys/                  # SurveyJS Creator, Renderer & Responses Table
│   │   └── users/                    # User Administration Forms & Activity Log
│   │
│   ├── hooks/                        # Shared Cross-Module Custom React Hooks
│   │   ├── navigation/               # Scroll preservation hooks
│   │   ├── search/                   # Recent searches hooks
│   │   ├── timing/                   # Debounce hooks
│   │   ├── url/                      # URL state sync & param parsers
│   │   └── index.ts                  # Root Hooks Barrel Export
│   │
│   ├── lib/                          # Utility Libraries & Client Instantiations
│   ├── middleware.ts                 # Next.js Edge Auth & Multi-Site Middleware
│   ├── store/                        # Global Client State Stores (Zustand)
│   │   ├── loader/                   # Global network loading store
│   │   ├── site/                     # Active tenant site info & branding store
│   │   ├── user/                     # Authenticated user session & role store
│   │   └── index.ts                  # Root Store Barrel Export
│   │
│   ├── styles/                       # CSS Custom Properties & Animations
│   ├── test/                         # Vitest Test Configuration & Mock Setup
│   │   └── setup.ts                  # Testing Library Jest DOM Extensions
│   │
│   ├── types/                        # TypeScript Interface & Type Definitions
│   │   ├── api/                      # Result & response status types
│   │   ├── customer/                 # Customer directory types
│   │   ├── globalSearch/             # Global search model types
│   │   ├── lead/                     # CRM lead management types
│   │   ├── prescription/             # Prescription audit types
│   │   ├── site/                     # Tenant site settings types
│   │   ├── survey/                   # SurveyJS & session types
│   │   └── index.ts                  # Root Types Barrel Export
│   │
│   └── utils/                        # Domain Calculators & Utility Helpers
│       ├── auth/                     # Auth redirection & post-login utilities
│       ├── branding/                 # Brand names & dynamic favicon replacer
│       ├── env/                      # Environment variables helpers
│       ├── helpers/                  # String, MD5, and normalization helpers
│       ├── http/                     # Fetch interceptor utilities
│       ├── url/                      # URL filter parsing & sort normalization
│       └── index.ts                  # Root Utils Barrel Export
│
├── .env                              # Active Local Environment Configuration
├── .env.development                  # Development Environment Settings Template
├── .env.example                      # Environment Variable Schema Reference
├── .env.local                        # Local Overrides (Ignored by Git)
├── .env.production                   # Production Environment Configuration
├── .gitignore                        # Git File Exclusion Definitions
├── .nvmrc                            # Node.js Version Specification (>=20.0.0)
├── GEMINI.md                         # Master Instructions Index for Gemini AI Agent
├── next.config.mjs                   # Next.js Framework & Proxy Configurations
├── package.json                      # Project Dependencies & NPM Scripts
├── package-lock.json                 # Locked Dependency Tree
├── postcss.config.mjs                # PostCSS & Tailwind v4 Plugin Pipeline
├── Procfile                          # Deployment Process Definition
├── README.md                         # Project Overview & Quick Start Guide
├── SURVEY_PLATFORM_SPEC.md           # Survey Platform Technical Spec Index
├── tsconfig.json                     # TypeScript Compiler Configuration
└── vitest.config.ts                  # Vitest Test Suite Configuration
```

---

## 🛠️ Key Module Responsibilities

| Layer / Directory | Primary Responsibility |
|-------------------|────────────────--------|
| `src/app/` | Defines Next.js App Router routes, page layouts, edge middleware routing, and page server components. |
| `src/components/` | Modular client-side UI islands organized by domain feature (`order-details`, `surveys`, `leads`, etc.). |
| `src/api/services/` | Centralized domain API services that communicate with the backend via `apiClient`. |
| `src/store/` | Zustand client state stores (`userStore`, `siteStore`, `globalLoaderStore`). |
| `src/types/` | Domain TypeScript interfaces for strict type safety across all components and API calls. |
| `docs/` | System architecture, API contracts, RBAC permissions, routes, and survey specifications. |
| `knowledge/` | Feature-level knowledge base for developers and AI coding assistants. |
| `.agents/rules/` | Modular rule files loaded by Gemini / Antigravity AI Agent. |
