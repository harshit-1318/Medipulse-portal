# 📚 MediPulse — Project Documentation Hub

Welcome to the **MediPulse Portal** documentation! This hub explains the architecture, security, multi-site system, and API patterns in a simple, easy-to-understand format.

---

## 📌 Git Repository Guidance

> [!IMPORTANT]
> **Should `docs/` be in `.gitignore`?**  
> **NO!** Do NOT put `docs/` in `.gitignore`.  
> Documentation is critical project source-of-truth knowledge. It MUST be committed to Git so all team members, developers, and AI agents have instant access to project specifications.

---

## 🧭 Documentation Sitemap & Quick Index

| Section | Description | File Link |
|:---|:---|:---|
| 🚀 **End-to-End Workflow** | Visual diagrams & file-by-file Frontend ⟷ Backend communication | [`WORKFLOW_AND_ARCHITECTURE.md`](WORKFLOW_AND_ARCHITECTURE.md) |
| 🏗️ **System Architecture** | Next.js 16 App Router, Server Components vs Client Boundaries, Data flow | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| 🔐 **Authentication** | JWT Cookies, LocalStorage fallback, Middleware, Auth Store | [`AUTH.md`](AUTH.md) |
| 👥 **RBAC Matrix** | User Roles (`super_admin`, `admin`, `prescriber`, `pharmacist`, `customer_support`) | [`RBAC.md`](RBAC.md) |
| 🌐 **Multi-Site System** | Multi-tenant header injection (`X-SITE-ID`, `X-SITE-KEY`, `X-SITE-HOST`) | [`MULTI-SITE.md`](MULTI-SITE.md) |
| 🗺️ **App Routes** | Route structure (`/dashboard`, `/orders`, `/sites`, `/surveys`, `/leads`, `/users`) | [`ROUTES.md`](ROUTES.md) |
| ⚙️ **State Management** | Global Client Stores (Zustand) vs Server State (TanStack Query v5) | [`STATE-MANAGEMENT.md`](STATE-MANAGEMENT.md) |
| 🔌 **API Contracts** | `apiClient` Axios wrapper, response envelope, site header interceptor | [`API-CONTRACTS.md`](API-CONTRACTS.md) |
| 🚀 **Deployment** | Environment variables, build process, production server setup | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| 🧪 **Testing** | Vitest unit test guidelines and mock patterns | [`TESTING.md`](TESTING.md) |
| 🔄 **Migration** | Legacy route and state migration reference | [`MIGRATION.md`](MIGRATION.md) |
| 📋 **Survey Specification** | Complete Survey Platform & CRM Lead Management spec | [`survey-spec/README.md`](survey-spec/README.md) |

---

## 💡 Quick Overview of MediPulse Architecture

```
[ Browser Request ] ➔ [ Next.js Edge Middleware ] ➔ [ App Router Pages ]
                                                           │
                                                           ▼
[ NestJS Backend ] ◄── [ apiClient + Site Headers ] ◄── [ TanStack Query ]
```

1. **Multi-Tenant Site Headers**: Injected automatically by `apiClient` interceptor on every XHR request. Never pass manually.
2. **5 Core Roles**: Enforced by Edge Middleware (`src/middleware.ts`) and Sidebar gating (`SidebarGroup.tsx`).
3. **State Rule**: Global UI state ➔ Zustand. Server data ➔ TanStack Query.
