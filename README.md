<div align="center">

  <img src="./public/medipulse-logo.svg" alt="MediPulse Logo" width="340" />

  <br/><br/>

  # MediPulse Portal
  ### Modern Enterprise Healthcare & Pharmacy Operations Platform

  [![Next.js 16](https://img.shields.io/badge/Next.js-16.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React 19.2](https://img.shields.io/badge/React-19.2.4-20232A?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript 5](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_9-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
  [![Vitest](https://img.shields.io/badge/Vitest-Passing_480+-729B1B?style=for-the-badge&logo=vitest)](https://vitest.dev/)

  <p align="center">
    <b>A production-grade, multi-tenant clinical management suite featuring prescription auditing, real-time order processing, dynamic survey creation, and strict role-based access control.</b>
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#️-technology-stack">Tech Stack</a> •
    <a href="#️-system-architecture">Architecture</a> •
    <a href="#-quick-start--installation">Quick Start</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-deployment-guide">Deployment</a>
  </p>

</div>

---

## ✨ Key Features

- 🩺 **Clinical Prescription Audit:** End-to-end clinical validation workflow with doctor approvals, contraindication checks, and dispensing verification.
- 📦 **Order Lifecycle & Store Sync:** Unified management across 7 order states (*Pending, Clinical Review, Approved, Dispensed, Parked, Urgent, Shipped*) with real-time automated e-commerce store data synchronization.
- 📝 **Dynamic Clinical Survey Builder:** Integrated SurveyJS (`survey-creator-react`) engine allowing clinical teams to design custom questionnaires, scoring rules, and view patient submissions.
- 👥 **Multi-Tenant Administration:** Tenant isolation and domain-based routing via `X-SITE-ID`, `X-SITE-KEY`, and `X-SITE-HOST` headers with dynamic clinic branding.
- 📊 **Executive & Operational Dashboards:** Real-time revenue telemetry, site performance statistics, prescriber workloads, and order throughput analytics.
- 🔒 **Enterprise-Grade Security:** Next.js 16 Edge Auth Proxy (`src/proxy.ts`), JWT validation, httpOnly cookie sessions, and 8-tier Role-Based Access Control (RBAC).
- 📜 **Full Forensic Audit Trails:** Chronological activity logging tracking prescription status changes, internal clinical notes, and user actions grouped by order ID.

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Hybrid Server/Client rendering, Turbopack, and Edge Proxying |
| **UI Library** | React 19.2.4 | Modern React server components, hooks, and transitions |
| **Language** | TypeScript 5.9.3 | Strict end-to-end type safety across client and server |
| **Database** | MongoDB Atlas & Mongoose 9 | Scalable document storage with connection pooling & caching |
| **Styling** | Tailwind CSS 4.2.1 | Modern utility-first CSS engine with design system tokens |
| **State Management** | Zustand v5 & TanStack Query v5 | Client state stores and reactive server cache synchronization |
| **Table Engine** | TanStack React Table v8 | Virtualized, multi-column sortable, and filterable data tables |
| **Survey Engine** | SurveyJS v2.5 | Drag-and-drop clinical questionnaire designer & runtime |
| **Icons & Motion** | Lucide React & Framer Motion | Accessible icons and smooth micro-interactions |
| **Testing** | Vitest v4 & Testing Library | Fast unit, component, and multi-role lifecycle security tests |

---

## 🏗️ System Architecture

```text
Browser Client
   │
   ▼
Next.js 16 Auth Proxy (src/proxy.ts)
   ├── Cryptographic JWT Verification & Role Derivation
   ├── Multi-Tier Route Protection (Super Admin vs Clinical Staff)
   └── Return URL Path Preservation
   │
   ▼
App Router Layouts & Pages (src/app/)
   ├── Centralized Typed API Client (src/lib/api/client.ts)
   │     ├── Bearer Token & Multi-Tenant Headers Injection
   │     └── Dynamic Host & Theme Detection
   │
   ├── Native Route Handlers (src/app/api/*)
   │     └── Direct MongoDB Atlas Mongoose Models (Users, Orders, Surveys, Leads)
   │
   └── Fallback Rewrites (next.config.mjs)
         └── External Backend Microservices (Optional)
```

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js** `>= 20.0.0`
* **npm** `>= 10.0.0`
* **MongoDB Atlas** cluster connection string

### 1. Clone the Repository
```bash
git clone https://github.com/harshit-1318/Medipulse-portal.git
cd Medipulse-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment template:
```bash
cp .env.example .env.local
```
Update `.env.local` with your MongoDB URI and application keys:
```bash
# Backend & API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
SERVER_API_BASE_URL=http://localhost:5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?appName=Cluster0

# Multi-Tenant Site Defaults
NEXT_PUBLIC_DEFAULT_SITE_HOST=portal.medipulse.co.uk
NEXT_PUBLIC_SURVEY_TOKEN_HEADER=X-Survey-Token

# Authentication & Security
AUTH_COOKIE_NAME=token
JWT_SECRET=your-secure-jwt-secret-key-at-least-32-chars-long
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ NPM Scripts Cheatsheet

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | Development Server | Boots Next.js 16 with Turbopack on `http://localhost:3000` |
| `npm run build` | Production Build | Creates optimized production build and validates 54 routes |
| `npm run start` | Production Server | Runs the compiled production build locally |
| `npm run typecheck` | Type Validation | Executes `tsc --noEmit` to verify TypeScript strictness |
| `npm test` | Automated Tests | Runs the full test suite (480+ tests) using Vitest |

---

## 🌐 Core REST API Reference

The portal includes integrated API routes backed by MongoDB Atlas:

| Endpoint | Method | Role Access | Description |
| :--- | :---: | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Authenticates credentials, sets httpOnly JWT & role cookies |
| `/api/auth/logout` | `POST` | Authenticated | Clears session cookies and invalidates client session |
| `/api/orders` | `GET` | Staff / Admin | Lists paginated orders with role-filtered customer data |
| `/api/orders/[id]` | `GET`, `PUT` | Prescriber / Admin | Detailed order payload, clinical status updates, & re-sync |
| `/api/prescriptions` | `GET`, `POST`| Prescriber / Pharm | Prescription audit tables and dispensing verification |
| `/api/surveys` | `GET`, `POST`| Admin / Prescriber | SurveyJS form definitions and schema versioning |
| `/api/surveys/[id]/responses` | `GET`, `POST` | Public / Staff | Submits patient questionnaire responses & review |
| `/api/users` | `GET`, `POST`| Admin / SuperAdmin | User administration, multi-site assignments, and role toggles |
| `/api/activity-log` | `GET` | Staff / Admin | Forensic audit logs categorized by order ID |
| `/api/super-admin/dashboard-stats` | `GET` | Super Admin | Cross-tenant metrics, revenue statistics, & platform health |

---

## 👥 Role-Based Access Control (RBAC)

The portal enforces granular permissions across 8 distinct user roles:

| Role | Access Scope & Capabilities |
| :--- | :--- |
| **Super Admin** | Unrestricted access across all tenant sites, global user management, platform analytics, & site provisioning. |
| **Admin** | Site-level management, order overrides, staff management, and operational reporting. |
| **Prescriber** | Clinical reviews, prescription approvals, clinical note creation, and questionnaire evaluations. |
| **Pharmacist** | Medication dispensing, prescription audits, pharmacy notes, and dispatching. |
| **Pharmacy Staff**| Order packing, fulfillment tracking, and status progression. |
| **Customer Support**| Order inquiries, ticket tracking, and patient communication. |
| **Driver** | Delivery queue visibility, route status, and drop-off confirmations. |
| **Customer** | View personal order progress and complete medical intake surveys. |

---

## 📁 Directory Structure

```text
src/
├── app/                              # Next.js 16 App Router (54+ routes)
│   ├── (auth)/login/                 # Public login authentication
│   ├── (dashboard)/                  # Authenticated portal views
│   │   ├── dashboard/                # Prescriber & staff operational dashboard
│   │   ├── super-dashboard/          # Super Admin multi-site metrics
│   │   ├── orders/                   # Orders list, filters, & order details
│   │   ├── prescriptions/            # Prescription verification & audit table
│   │   ├── surveys/                  # SurveyJS creator, manager, & response viewer
│   │   ├── users/                    # User administration & role management
│   │   ├── customers/                # Customer directory & order history
│   │   ├── leads/                    # Survey auto-generated clinical leads
│   │   ├── activity-logs/            # Audit trail grouped by order ID
│   │   └── sites/                    # Multi-tenant site management
│   ├── api/                          # Next.js REST API route handlers
│   └── layout.tsx                    # Root shell layout with QueryClientProvider
│
├── components/                       # Modular UI components
│   ├── order-details/                # Prescription review, BMI gauge, comms
│   ├── orders-table/                 # High-performance order list views
│   ├── surveys/                      # Survey builder & dynamic forms
│   ├── users/                        # User forms, password toggles, filters
│   └── layout/                       # Sidebar, headers, site branding
│
├── lib/
│   ├── db/                           # Mongoose connection & data models
│   │   └── models/                   # User, Order, Survey, Customer, Lead
│   └── auth/                         # JWT encoding, decoding & token verification
│
├── proxy.ts                          # Next.js 16 Edge Auth & Proxy middleware
├── proxyRoutes.ts                    # Protected & public route definitions
├── store/                            # Zustand stores (siteStore, userStore)
├── styles/                           # Tailwind CSS v4 & theme sheets
└── test/                             # Vitest test suites & lifecycle audits
```

---

## 🚀 Deployment Guide

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import `Medipulse-portal`.
4. In **Project Settings ➔ Environment Variables**, add:
   * `MONGODB_URI`
   * `JWT_SECRET`
   * `NEXT_PUBLIC_DEFAULT_SITE_HOST`
   * `NEXT_PUBLIC_API_BASE_URL` *(if using external backend)*
5. Click **Deploy**. Vercel will automatically compile with Turbopack and provision SSL.

> **Important MongoDB Atlas Note:** In MongoDB Atlas, navigate to **Network Access ➔ IP Access List** and ensure `0.0.0.0/0` (Allow Access from Anywhere) is added to allow Vercel serverless functions to connect.

---

## 📚 Documentation Index

Detailed architectural and engineering documentation is available in the [`docs/`](docs/) directory:

- 📘 [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Architectural design, server/client boundaries, and data flow.
- 🛣️ [ROUTES.md](docs/ROUTES.md) — Complete 54-route inventory, URL parameters, and access permissions.
- 🔐 [AUTH.md](docs/AUTH.md) — JWT mechanics, Next.js Proxy, cookie lifecycles, and security measures.
- 👥 [RBAC.md](docs/RBAC.md) — Comprehensive role-based permission matrix.
- 🌐 [MULTI-SITE.md](docs/MULTI-SITE.md) — Multi-tenant domain resolution and dynamic styling.
- ⚡ [STATE-MANAGEMENT.md](docs/STATE-MANAGEMENT.md) — Zustand and TanStack Query integration.
- 🧪 [TESTING.md](docs/TESTING.md) — Vitest conventions, mock helpers, and test catalogs.

---

<div align="center">
  <sub>Built with ❤️ for modern healthcare operations • MediPulse Portal</sub>
</div>
