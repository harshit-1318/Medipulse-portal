# 🏥 MediPulse Portal — Modern Healthcare & Pharmacy Operations

[![Next.js 16](https://img.shields.io/badge/Next.js-16.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19.2](https://img.shields.io/badge/React-19.2.4-20232A?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_9-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Vitest](https://img.shields.io/badge/Vitest-Passed_480+-729B1B?style=for-the-badge&logo=vitest)](https://vitest.dev/)

> **MediPulse Portal** is a production-grade, multi-tenant healthcare administration, prescription management, clinical survey builder, and audit portal built with Next.js 16 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS 4, and MongoDB.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🏗️ System Architecture](#️-system-architecture)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [🔐 Environment Configuration](#-environment-configuration)
- [📁 Directory Structure](#-directory-structure)
- [👥 Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [🚀 Deployment Guide](#-deployment-guide)
- [📚 Documentation Index](#-documentation-index)

---

## ✨ Key Features

- 🩺 **Clinical Prescription Audit:** Review prescriptions, doctor approvals, medication logs, and clinical safety checks.
- 📦 **Order Management:** Full order lifecycles (Pending, Clinical Review, Approved, Dispensed, Parked, Urgent, Shipped) with Shopify auto-resync.
- 📝 **Dynamic Survey Builder:** Powered by SurveyJS (`survey-creator-react`), enabling custom medical questionnaires, clinical scoring, and patient response tracking.
- 👥 **Multi-Tenant Administration:** Host-based multi-tenancy (`X-SITE-ID`, `X-SITE-KEY`, `X-SITE-HOST`) supporting distinct branding, themes, and configuration per clinic/pharmacy.
- 📊 **Super Admin & Analytics Dashboards:** Real-time metrics, revenue monitoring, activity timeline charts, and audit trails.
- 🔒 **Enterprise Security:** Next.js 16 Proxy Middleware, JWT validation, httpOnly cookie sessions, and strict Role-Based Access Control (RBAC).
- 📜 **Full Activity Audit Logging:** Tracks order status modifications, internal notes, prescription verifications, and user actions.

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Hybrid Server Components, Turbopack, and Proxy Routing |
| **UI Library** | React 19.2.4 | Modern hooks, concurrent rendering, and server actions |
| **Language** | TypeScript 5.9.3 | Strict type definitions across frontend and backend |
| **Database** | MongoDB Atlas & Mongoose 9 | Connection caching, indexing, and schema modeling |
| **Styling** | Tailwind CSS 4.2.1 | Modern utility-first CSS with custom design tokens |
| **State Management** | Zustand v5 & TanStack Query v5 | Client-side reactive stores and cached server data |
| **Table Engine** | TanStack React Table v8 | Virtualized, sortable, and filterable data tables |
| **Survey Engine** | SurveyJS v2.5 | Dynamic clinical survey creator & respondent UI |
| **Icons & Motion** | Lucide React & Framer Motion | Crisp iconography and smooth UI micro-animations |
| **Testing** | Vitest v4 & React Testing Library | Fast unit, component, and security audit tests |

---

## 🏗️ System Architecture

```text
Browser Client
   │
   ▼
Next.js 16 Auth Proxy (src/proxy.ts)
   ├── JWT Verification & Expiry Inspection
   ├── Role Routing (Super Admin vs Clinical Roles)
   └── Return URL Path Restoration
   │
   ▼
App Router Layouts & Pages (src/app/)
   ├── Centralized Typed API Client (src/lib/api/client.ts)
   │     ├── Bearer Token & Multi-Tenant Headers
   │     └── Dynamic Host & Theme Detection
   │
   ├── Next.js Route Handlers (src/app/api/*)
   │     └── Native MongoDB Atlas Collections (Users, Orders, Surveys, Leads)
   │
   └── Fallback Rewrites (next.config.mjs)
         └── External Backend Services (optional)
```

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js** `>= 20.0.0`
* **npm** `>= 10.0.0`
* **MongoDB Atlas** database cluster (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/harshit-1318/Medipulse-portal.git
cd Medipulse-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the example environment template:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your MongoDB Atlas connection string and secrets (see below).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Configuration

All environment variables are managed securely and kept out of version control. Use `.env.example` as a template:

```bash
# ------------------------------------------------------------------------------
# Backend & API Configuration
# ------------------------------------------------------------------------------
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
SERVER_API_BASE_URL=http://localhost:5000

# ------------------------------------------------------------------------------
# Database (MongoDB Atlas)
# ------------------------------------------------------------------------------
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?appName=Cluster0

# ------------------------------------------------------------------------------
# Multi-Tenant Site Defaults
# ------------------------------------------------------------------------------
NEXT_PUBLIC_DEFAULT_SITE_HOST=portal.medipulse.co.uk
NEXT_PUBLIC_SURVEY_TOKEN_HEADER=X-Survey-Token

# ------------------------------------------------------------------------------
# Authentication & Security
# ------------------------------------------------------------------------------
AUTH_COOKIE_NAME=token
JWT_SECRET=your-secure-jwt-secret-key-at-least-32-chars-long
```

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

## 👥 Role-Based Access Control (RBAC)

The portal enforces granular permissions across 8 distinct user roles:

| Role | Permissions & Access Scope |
| :--- | :--- |
| **Super Admin** | Unrestricted access across all tenant sites, user creation, analytics, & global configs. |
| **Admin** | Site-level administration, team management, order overrides, and reporting. |
| **Prescriber** | Clinical reviews, prescription approvals, order re-sync, and questionnaire evaluations. |
| **Pharmacist** | Medication dispensing, prescription audits, pharmacy notes, and dispatching. |
| **Pharmacy Staff**| Order packing, status tracking, and fulfillment operations. |
| **Customer Support**| Order inquiries, customer communication, and dispute handling. |
| **Driver** | Delivery queue, route status, and drop-off confirmations. |
| **Customer** | View individual orders and complete clinical surveys. |

---

## 🧪 Testing & Quality Assurance

The codebase includes an extensive automated test suite covering unit tests, component tests, and end-to-end security audits:

```bash
# Run Vitest test suite
npm test

# Run TypeScript compiler check (0 errors)
npm run typecheck

# Build for production
npm run build
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

*(Tip: In MongoDB Atlas, ensure `0.0.0.0/0` is added to Network Access IP Whitelist to allow Vercel serverless connections).*

---

## 📚 Documentation Index

Detailed engineering documentation is located in the [`docs/`](docs/) directory:

- 📘 [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Architectural design, server/client boundaries, and data flow.
- 🛣️ [ROUTES.md](docs/ROUTES.md) — 54-route inventory, URL parameters, and access permissions.
- 🔐 [AUTH.md](docs/AUTH.md) — JWT mechanics, Next.js Proxy, cookie lifecycles, and security measures.
- 👥 [RBAC.md](docs/RBAC.md) — Detailed role-based permission matrix.
- 🌐 [MULTI-SITE.md](docs/MULTI-SITE.md) — Multi-tenant domain resolution and dynamic styling.
- ⚡ [STATE-MANAGEMENT.md](docs/STATE-MANAGEMENT.md) — Zustand and TanStack Query integration.
- 🧪 [TESTING.md](docs/TESTING.md) — Vitest conventions, mock helpers, and test catalogs.

---

## 📄 License

This project is proprietary and maintained for MediPulse healthcare operations.
