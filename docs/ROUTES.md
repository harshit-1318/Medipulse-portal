# Routes & Navigation Documentation — MediPulse Portal

## 1. Route Map (All 55 Routes)

| Next.js App Router Path | Route Type | Auth Level | Allowed Roles | Primary Component / Module |
|---|---|---|---|---|
| `/` | Dynamic Redirect | Public | All Roles | Root redirect handler (`/login`, `/super-dashboard`, or `/dashboard`) |
| `/login` | Public | Unauthenticated | All Roles | `LoginForm`, Site Branding Logo |
| `/account` | Authenticated | Token Required | All Roles | `AccountSettings` |
| `/dashboard` | Authenticated | Token Required | Non-Super Admin | `DashboardContent` |
| `/super-dashboard` | Authenticated | Token Required | `super_admin` | `SuperAdminDashboardPage` |
| `/orders/all` | Authenticated | Token Required | All Roles | `AllOrdersContent` |
| `/orders/search` | Authenticated | Token Required | All Roles | `SearchOrdersContent` |
| `/orders/urgent` | Authenticated | Token Required | All Roles | `UrgentOrdersContent` |
| `/orders/parked` | Authenticated | Token Required | All Roles | `ParkedOrdersContent` |
| `/orders/status/[status]` | Authenticated | Token Required | All Roles | `StatusOrdersContent` (`cancelled`, `fulfilled`, `on-hold`, `unfulfilled`) |
| `/orders/customer/[type]` | Authenticated | Token Required | All Roles | `CustomerOrdersContent` (`first`, `repeat`) |
| `/orders/product/[type]` | Authenticated | Token Required | All Roles | `ProductOrdersContent` (`injectable`, `oral`) |
| `/orders/document/[type]` | Authenticated | Token Required | All Roles | `DocumentOrdersContent` (`uploaded`, `not-uploaded`) |
| `/orders/category/[category]` | Authenticated | Token Required | All Roles | `CategoryOrdersContent` (12 Medical Categories) |
| `/orders/view/[id]` | Authenticated | Token Required | All Roles | `OrderDetailsPage` (BMI, Questions, Consultation Tabs) |
| `/orders/[id]/video-player` | Authenticated | Token / Key | All Roles | `VideoPlayerPage` (Standalone Video View) |
| `/customers` | Authenticated | Token Required | All Roles | `CustomersPage` |
| `/leads` | Authenticated | Token Required | All Roles | `LeadsPage` |
| `/prescriptions` | Authenticated | Token Required | All Roles | `PrescriptionsPage` |
| `/queue-monitor` | Authenticated | Token Required | Admin / Super Admin | `EmailQueueMonitorPage` |
| `/docman-jobs` | Authenticated | Token Required | All Roles | `DocmanJobsPage` |
| `/users` | Authenticated | Token Required | Admin / Super Admin | `UsersListPage` |
| `/users/create` | Authenticated | Token Required | Admin / Super Admin | `UserFormPage` |
| `/users/[id]` | Authenticated | Token Required | Admin / Super Admin | `UserDetailPage` |
| `/users/[id]/edit` | Authenticated | Token Required | Admin / Super Admin | `UserFormPage` |
| `/sites` | Authenticated | Token Required | `super_admin` | `SitesListPage` |
| `/sites/create` | Authenticated | Token Required | `super_admin` | `SiteSettingsPage` |
| `/sites/[id]` | Authenticated | Token Required | `super_admin` | `SiteDetailPage` |
| `/sites/[id]/edit` | Authenticated | Token Required | `super_admin` | `SiteSettingsPage` |
| `/activity-logs` | Authenticated | Token Required | Admin / Super Admin | `ActivityLogsContent` |
| `/activity-logs/email-history` | Authenticated | Token Required | Admin / Super Admin | `ActivityLogsContent` (`defaultAction=email_sent`) |
| `/surveys` | Authenticated | Token Required | Admin / Super Admin | `SurveysPage` |
| `/surveys/create` | Authenticated | Token Required | Admin / Super Admin | `SurveyBuilderPage` (SurveyJS Creator) |
| `/surveys/responses` | Authenticated | Token Required | Admin / Super Admin | `SurveyResponsesPage` |
| `/surveys/[id]` | Authenticated | Token Required | Admin / Super Admin | `SurveyViewPage` |
| `/surveys/[id]/edit` | Authenticated | Token Required | Admin / Super Admin | `SurveyBuilderPage` |
| `/surveys/[id]/responses` | Authenticated | Token Required | Admin / Super Admin | `SurveyResponsesPage` |
| `/s/[token]` | Public Token | Session Token Header | Public Customer | `PublicSurveyPage` (SurveyJS Renderer) |

---

## 2. Route Protection Rules
1. Edge Middleware intercepts every request before rendering.
2. Unauthenticated requests to protected paths preserve return URL and redirect to `/login`.
3. Logged-in users attempting to open `/login` are automatically redirected to their role dashboard.
4. Non-super-admin users attempting to open `/super-dashboard` are redirected to `/dashboard`.
