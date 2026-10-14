# MediPulse Architecture Documentation Hub

Welcome to the comprehensive system architecture documentation for **MediPulse Portal**. This repository directory houses all system workflow diagrams, interactive visual models, and senior architectural technical reports.

---

## 🧭 Architecture Flows Index

| Flow # | System Workflow | Interactive Diagram (HTML) | Mermaid Source | Architectural Deep-Dive |
| :---: | :--- | :--- | :--- | :--- |
| **0** | **Login & Authentication Flow** | [Open Diagram](./login-flow/login-architecture.html) | [`login-flow.mmd`](./login-flow/login-flow.mmd) | [Full Report](./login-flow/login-flow-report.md) |
| **1** | **Orders Lifecycle & Clinical Workflow** | [Open Diagram](./orders-flow/orders-architecture.html) | [`orders-flow.mmd`](./orders-flow/orders-flow.mmd) | [Full Report](./orders-flow/orders-flow-report.md) |
| **2** | **Multi-Tenant & Multi-Site Routing Flow** | [Open Diagram](./multi-site-flow/multi-site-architecture.html) | [`multi-site-flow.mmd`](./multi-site-flow/multi-site-flow.mmd) | [Full Report](./multi-site-flow/multi-site-flow-report.md) |
| **3** | **SurveyJS & Clinical Lead Intake Flow** | [Open Diagram](./survey-flow/survey-architecture.html) | [`survey-flow.mmd`](./survey-flow/survey-flow.mmd) | [Full Report](./survey-flow/survey-flow-report.md) |
| **4** | **Dual-Endpoint Customers & Sort Parity** | [Open Diagram](./customer-flow/customer-architecture.html) | [`customer-flow.mmd`](./customer-flow/customer-flow.mmd) | [Full Report](./customer-flow/customer-flow-report.md) |
| **5** | **Real-Time Audit Activity Logging Flow** | [Open Diagram](./activity-log-flow/activity-log-architecture.html) | [`activity-log-flow.mmd`](./activity-log-flow/activity-log-flow.mmd) | [Full Report](./activity-log-flow/activity-log-flow-report.md) |
| **6** | **Docman Jobs & Document Processing Flow** | [Open Diagram](./docman-flow/docman-architecture.html) | [`docman-flow.mmd`](./docman-flow/docman-flow.mmd) | [Full Report](./docman-flow/docman-flow-report.md) |

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
