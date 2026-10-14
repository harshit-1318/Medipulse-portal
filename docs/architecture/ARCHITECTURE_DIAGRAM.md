# MediPulse Portal — System Architecture Diagram

This directory contains the architecture documentation and interactive visual diagrams for the MediPulse Healthcare Admin Portal.

---

## 🎨 Interactive Architecture Diagram (Archify)

An interactive, animated diagram generated using **Archify** is available at:
👉 **[`medipulse-architecture.html`](./medipulse-architecture.html)**

- **Local Absolute Path:** `D:\New projects\1 MediPulse\docs\architecture\medipulse-architecture.html`
- **Features:** Zoom & pan, Dark/Light theme toggle, animated dataflow paths, interactive inspection cards, and component focus.

---

## 📊 System Flowchart (Mermaid)

```mermaid
flowchart TD
    %% Styling
    classDef clientStyle fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1
    classDef proxyStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e
    classDef uiStyle fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#15803d
    classDef stateStyle fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px,color:#5b21b6
    classDef apiStyle fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px,color:#3730a3
    classDef authStyle fill:#ffe4e6,stroke:#e11d48,stroke-width:2px,color:#9f1239
    classDef dbStyle fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#047857
    classDef extStyle fill:#f1f5f9,stroke:#64748b,stroke-width:1.5px,stroke-dasharray: 4 4,color:#334155

    subgraph ClientTier [" 1. Client Tier "]
        Browser["🖥️ Client Browser<br/>(Desktop / Mobile Web)"]:::clientStyle
    end

    subgraph EdgeTier [" 2. Edge Routing & Security "]
        Proxy["🛡️ Next.js Route Proxy<br/><b>src/proxy.ts</b><br/>• Session JWT Verification<br/>• Role Access Checks (RBAC)<br/>• Dashboard Separation (/super-dashboard vs /dashboard)"]:::proxyStyle
    end

    subgraph PresentationTier [" 3. Next.js 16 App Router UI Tier "]
        direction TB
        AppShell["🖼️ App Shell & Layouts<br/><b>RootLayout</b> (QueryClientProvider)<br/><b>DashboardLayout</b> (Sidebar, Header, IdleSessionManager)"]:::uiStyle
        
        FeaturePages["📄 Pages & Components (React 19)<br/>• Orders Table & Detail Drawer<br/>• SurveyJS Creator & Responses<br/>• Leads, Customers & Prescriptions"]:::uiStyle
        
        StateStores["⚡ Client State Management<br/>• <b>TanStack Query v5</b> (Server Cache & Hydration)<br/>• <b>Zustand Stores</b> (userStore, siteStore, globalLoader)"]:::stateStyle

        AppShell --> FeaturePages
        FeaturePages <--> StateStores
    end

    subgraph NetworkTier [" 4. Unified Network & Client Layer "]
        APIClient["🔌 Centralized Axios Client<br/><b>src/lib/api/client.ts (apiClient)</b><br/>• Request Interceptor: Bearer Token + X-SITE-* Headers<br/>• Response Interceptor: 401 Auto-Logout & Global Loader Tracker"]:::apiStyle
    end

    subgraph BackendTier [" 5. API Handlers & Security Layer "]
        direction TB
        AuthGuard["🔐 API Auth Guard<br/><b>src/lib/auth/apiAuth.ts</b><br/>• HMAC SHA-256 Signature Verification<br/>• Role Permission Matrix"]:::authStyle

        RouteHandlers["⚡ App Router API Handlers<br/><b>src/app/api/* (route.ts)</b><br/>• /api/auth (Login, JWT Cookies)<br/>• /api/orders, /api/surveys, /api/customers"]:::apiStyle

        AuditLogger["📝 Audit Logger<br/><b>src/lib/db/logActivityHelper.ts</b><br/>• Immutable ActivityLog Collection"]:::authStyle

        ExtBackend["🌐 External Backend API<br/>(Optional NestJS Services)<br/>• Configured via next.config.mjs rewrites"]:::extStyle

        RouteHandlers --> AuthGuard
        RouteHandlers -.-> AuditLogger
    end

    subgraph PersistenceTier [" 6. Data Persistence Tier "]
        direction TB
        MongooseODM["🗄️ Mongoose ODM Layer<br/><b>src/lib/db/mongodb.ts</b><br/>• Cached Connection Pooling<br/>• Models: Order, User, Customer, Survey, Lead, Rx"]:::dbStyle

        MongoDBAtlas[("🍃 MongoDB Atlas<br/>(Cloud Cluster / Replica Set)")]:::dbStyle

        MongooseODM --> MongoDBAtlas
    end

    %% Data Flow Connections
    Browser -->|"HTTPS / Navigation"| Proxy
    Proxy -->|"Session Valid & Authorized"| AppShell
    Proxy -.->|"Unauthenticated"| LoginRedirect["Redirect to /login"]:::proxyStyle

    FeaturePages -->|"TanStack Query Hooks"| APIClient
    APIClient -->|"/api/* Internal Requests"| RouteHandlers
    APIClient -.->|"Fallback Rewrites"| ExtBackend

    RouteHandlers -->|"Authorized CRUD Operations"| MongooseODM
```

---

## 🔍 Layer-by-Layer Architecture Details

1. **Client Tier**: Web browsers run React 19 UI with client components marked with `'use client'`.
2. **Edge Proxy (`src/proxy.ts`)**: Evaluates authentication before page rendering, verifying JWT cookie tokens and preventing cookie spoofing through token role validation.
3. **App Router Presentation Tier**: Nested layouts provide session inactivity monitoring (`IdleSessionManager`), site branding initialization, and responsive navigation.
4. **Network Tier (`apiClient`)**: Singleton Axios client automatically injects authorization tokens and multi-tenant site identifiers (`X-SITE-ID`, `X-SITE-KEY`, `X-SITE-HOST`).
5. **Backend Handlers & Auth Guard**: Next.js route handlers validate incoming requests with `verifyApiAuth` using the Web Crypto API HMAC SHA-256 engine.
6. **Persistence Tier**: Cached MongoDB connections prevent connection leaks during serverless hot-reloads, with typed Mongoose models enforcing schema integrity.
