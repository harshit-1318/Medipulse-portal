# API Contracts & Service Mapping — MediPulse Portal

## 1. Backend Endpoint Inventory

All requests target your NestJS backend API configured via `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:5000`).

| Feature Module | HTTP Method | Endpoint Path | Query / Path Parameters | Body Payload | Target Hook / Service |
|---|---|---|---|---|---|
| **Authentication** | POST | `/auth/login` | None | `{ email, password }` | `useLoginMutation` |
| **Site Detection** | GET | `/sites/get-info-by-domain` | `?host=<domain>` | None (Public) | `useSiteInfoQuery` |
| **Sites Management**| GET | `/sites` | `?page, limit, search` | None | `useSitesListQuery` |
| **Sites Management**| POST | `/sites` | None | `{ name, domain, logo, small_icon_url, key }` | `useCreateSiteMutation` |
| **Orders Directory**| GET | `/orders` | `page, limit, search, status, category, customerType, productType, docStatus, startDate, endDate` | None | `useOrdersListQuery` |
| **Order Details**   | GET | `/orders/:id` | None | None | `useOrderDetailsQuery` |
| **Order Status Update**| POST | `/orders/:id/update-status` | None | `{ status, note }` | `useUpdateOrderStatusMutation` |
| **Internal Notes**  | POST | `/orders/:id/internal-notes` | None | `{ note }` | `useAddInternalNoteMutation` |
| **Video Room Create**| POST | `/video/create-room/:orderId` | None | `{ type: 'video' \| 'in_person_video' }` | `useCreateVideoRoomMutation` |
| **Customer Email**  | POST | `/orders/:id/send-email` | None | `{ type, customMessage, templateId }` | `useSendCustomerEmailMutation` |
| **GP Email**        | POST | `/orders/:id/send-gp-email` | None | `{ gpEmail, customMessage }` | `useSendGpEmailMutation` |
| **Customers**       | GET | `/customers` | `page, limit, search, siteId` | None | `useCustomersQuery` |
| **CRM Leads**       | GET | `/leads` | `page, limit, search, status, siteId` | None | `useLeadsQuery` |
| **Prescriptions**   | GET | `/prescriptions` | `page, limit, search, status` | None | `usePrescriptionsQuery` |
| **Surveys (Admin)** | GET | `/surveys` | `page, limit, search, status` | None | `useSurveysQuery` |
| **Surveys (Admin)** | POST | `/surveys` | None | `{ title, description, jsonSchema }` | `useCreateSurveyMutation` |
| **Survey Send**     | POST | `/surveys/:id/send` | None | `{ customerId, orderId, email }` | `useSendSurveyMutation` |
| **Public Survey**   | GET | `/public/surveys/session` | Header `X-Survey-Token` | None | `usePublicSurveySessionQuery` |
| **Public Survey**   | PATCH| `/public/surveys/session/auto-save` | Header `X-Survey-Token` | `{ partialResponse, currentPage }` | `useAutoSaveSurveyMutation` |
| **Public Survey**   | POST | `/public/surveys/session/submit` | Header `X-Survey-Token` | `{ submittedResponse }` | `useSubmitSurveyMutation` |
| **Users Admin**     | GET | `/users` | `page, limit, search, role` | None | `useUsersListQuery` |
| **Users Admin**     | PATCH| `/users/:id` | None | `{ is_active, password, role }` | `useUpdateUserMutation` |
| **Activity Log**    | GET | `/activity-log` | `page, limit, search, action, siteId, startDate, endDate` | None | `useActivityLogsQuery` |
| **Activity Log**    | POST | `/activity-log` | None | `{ action_type, view, object_guid, metadata }` | `useLogActivityMutation` |
| **Activity Dash**   | GET | `/super-admin/activity-dashboard` | `?days=7|30|90` | None | `useActivityDashboardQuery` |
| **Global Search**   | GET | `/global-search` | `?q=<term>` | None | `useGlobalSearchQuery` |

---

## 2. Response Envelope Unwrapping
All backend endpoints respond in standard envelopes unwrapped by `apiClient`:

```typescript
// Status envelope
{ status: "SUCCESS", data: T, message?: string }

// Success envelope
{ success: true, data: T, message?: string }
```
`apiClient` automatically extracts `data` and rejects Promises on error envelope codes.
