# MediPulse Architecture Documentation Hub

Welcome to the comprehensive system architecture documentation for **MediPulse Portal**. This repository directory houses all system workflow diagrams, interactive visual models, and senior architectural technical reports, organized in sequential learning order.

---

## 🧭 Architecture Flows Index (Sequential Order)

| # | System Workflow | Purpose & Scope | Interactive Diagram (HTML) | Mermaid Source | Architectural Deep-Dive |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **01** | **Login & Authentication Flow** | JWT Cookies, HMAC SHA-256, Edge Proxy RBAC | [Open Diagram](./01-login-flow/login-architecture.html) | [`login-flow.mmd`](./01-login-flow/login-flow.mmd) | [Full Report](./01-login-flow/login-flow-report.md) |
| **02** | **Multi-Tenant Site Routing Flow** | Domain Detection, SiteStore & Header Interceptor | [Open Diagram](./02-multi-site-flow/multi-site-architecture.html) | [`multi-site-flow.mmd`](./02-multi-site-flow/multi-site-flow.mmd) | [Full Report](./02-multi-site-flow/multi-site-flow-report.md) |
| **03** | **SurveyJS & Clinical Intake Flow** | SurveyJS Creator, Public Runner & Lead Intake | [Open Diagram](./03-survey-flow/survey-architecture.html) | [`survey-flow.mmd`](./03-survey-flow/survey-flow.mmd) | [Full Report](./03-survey-flow/survey-flow-report.md) |
| **04** | **Orders Lifecycle & Clinical Workflow** | TanStack Table, Order Params & Status Transitions | [Open Diagram](./04-orders-flow/orders-architecture.html) | [`orders-flow.mmd`](./04-orders-flow/orders-flow.mmd) | [Full Report](./04-orders-flow/orders-flow-report.md) |
| **05** | **Dual-Endpoint Customers & Sort Parity** | CRM Customer Routing & BIGINT ID Deserialization | [Open Diagram](./05-customer-flow/customer-architecture.html) | [`customer-flow.mmd`](./05-customer-flow/customer-flow.mmd) | [Full Report](./05-customer-flow/customer-flow-report.md) |
| **06** | **Docman Jobs & Document Processing** | NHS/Clinic Asynchronous Document Dispatch Queue | [Open Diagram](./06-docman-flow/docman-architecture.html) | [`docman-flow.mmd`](./06-docman-flow/docman-flow.mmd) | [Full Report](./06-docman-flow/docman-flow-report.md) |
| **07** | **Real-Time Audit Activity Logging Flow** | Non-blocking Audit Logging & Query Filtering | [Open Diagram](./07-activity-log-flow/activity-log-architecture.html) | [`activity-log-flow.mmd`](./07-activity-log-flow/activity-log-flow.mmd) | [Full Report](./07-activity-log-flow/activity-log-flow-report.md) |

---

## 🎨 Global System Overview
- **Global Overview Diagram**: [medipulse-architecture.html](./medipulse-architecture.html)
- **High-Level Tier Diagram**: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)

---

## 🛠️ How to View & Run Interactive Diagrams
- ⚡ **Command Guide & Quick Launchers**: 👉 **[HOW_TO_RUN_DIAGRAMS.md](./HOW_TO_RUN_DIAGRAMS.md)** (PowerShell one-liners, local HTTP server, and Windows shortcuts)
- 🖱️ **Windows 1-Click Launcher**: Double-click [`open-diagrams.bat`](./open-diagrams.bat) to launch all diagrams in browser tabs.

All `.html` files in this directory are **standalone, self-contained interactive visual architectures** built with zero external dependencies. You can open any `.html` file directly in Google Chrome, Microsoft Edge, or Firefox:
- **Pan & Zoom**: Click and drag to pan across the architecture canvas; use mouse wheel to zoom in and out.
- **Interactive Nodes**: Click any component or handler node to inspect its verified source code location, file path, and implementation details.
- **Step Playback / Scrubber**: Use the step scrubber controls to step through the chronological execution sequence step-by-step.
- **Search & Filter**: Search for specific tokens, cookies, or functions to highlight relevant execution nodes.
