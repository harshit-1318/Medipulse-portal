# Role-Based Access Control (RBAC) Matrix — MediPulse Portal

## 1. Role Definitions

| Role Code | Role Title | Description & Scope |
|---|---|---|
| `super_admin` | Super Administrator | Full system permissions: multi-site management, system analytics, user management, site API keys. |
| `admin` | Site Administrator | Full operational management: staff users, activity logs, surveys, email queue monitor, orders. |
| `prescriber` | Prescribing Clinician | Clinical order reviews, consultation answers, BMI stickman gauge evaluation, communication actions, re-sync. |
| `pharmacist` | Dispensing Pharmacist | Order fulfillment, document upload checks, prescription status updates. |
| `customer_support`| Support Staff | Customer directory, order search, notes, communication log inspection. |

---

## 2. Feature & Navigation Permission Matrix

| Feature Area / Route | `super_admin` | `admin` | `prescriber` | `pharmacist` | `customer_support` |
|---|---|---|---|---|---|
| **Root Dashboard (`/dashboard`)** | Redirects to `/super-dashboard` | ✅ | ✅ | ✅ | ✅ |
| **Super Admin Dashboard (`/super-dashboard`)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Sites Management (`/sites/*`)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Orders Directory (`/orders/*`)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Order Re-Sync Action** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Order Status Edit** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Users Admin (`/users/*`)** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Password Masking Toggle** | ✅ (Visible toggle) | Masked | Masked | Masked | Masked |
| **Surveys Builder (`/surveys/*`)** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Email Queue Monitor (`/queue-monitor`)** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Activity Audit Logs (`/activity-logs`)** | ✅ | ✅ | ❌ | ❌ | ❌ |
