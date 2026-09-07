# 3.5 & 3.6 API Specification: Lead Management & Quick Reference

## 3.5 Lead Management (Admin)

#### `GET /leads`
* **Query Parameters:** `page`, `limit`, `status`, `assignedTo` (userId), `surveyId`, `search`, `from`, `to`, `sortBy`, `sort`
* **Description:** Retrieves paginated list of leads with multi-filter and search support.

#### `GET /leads/stats`
* **Description:** Returns aggregate lead counts grouped by status (`total`, `new`, `contacted`, `qualified`, `closed`, `lost`).

#### `GET /leads/:id`
* **Description:** Full lead profile including `submittedResponse`, `notes[]`, `activityLog[]`, and populated `customer`, `assignedTo`, `survey`.

#### `PUT /leads/:id`
* **Request Body:** `{ "status": "contacted", "assignedTo": "ObjectId or null" }`
* **Description:** Update general lead fields.

#### `PATCH /leads/:id/status`
* **Request Body:** `{ "status": "qualified" }`
* **Description:** Updates status and automatically logs `status_changed` in `activityLog`.

#### `PATCH /leads/:id/assign`
* **Request Body:** `{ "userId": "ObjectId or null" }`
* **Description:** Assigns / reassigns lead to staff and logs `assigned` in `activityLog`.

#### `GET /leads/:id/notes` & `POST /leads/:id/notes`
* **Request Body (`POST`):** `{ "text": "Customer called back; requested follow-up tomorrow" }`
* **Description:** Fetch or append internal staff notes. `POST` automatically logs `note_added` in `activityLog`.

#### `GET /leads/:id/activity`
* **Description:** Retrieves complete chronological audit trail and timeline.

---

## 3.6 Endpoint Quick Reference

### 📋 1. Survey Management & Versioning
> **Auth:** Admin Bearer Token + `X-SITE-*` Headers

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/surveys` | List all surveys (paginated, filterable, search) |
| `POST` | `/surveys` | Create a new survey draft |
| `GET` | `/surveys/stats` | Aggregate stats (total, active, completions) |
| `GET` | `/surveys/:id` | Get survey details and schema by ID |
| `PUT` | `/surveys/:id` | Save draft schema |
| `DELETE` | `/surveys/:id` | Delete survey |
| `POST` | `/surveys/:id/publish` | Publish current draft as active version |
| `POST` | `/surveys/:id/unpublish` | Unpublish survey (set to draft) |
| `POST` | `/surveys/:id/duplicate` | Duplicate existing survey as a new draft |
| `PUT` | `/surveys/:id/settings` | Update survey settings (expiry, captcha, limits) |
| `GET` | `/surveys/:id/versions` | List version history for a survey |
| `GET` | `/surveys/:id/versions/:v` | Fetch specific version schema |
| `POST` | `/surveys/:id/rollback/:v` | Roll back schema to version `:v` |

---

### 🚀 2. Survey Distribution & Responses
> **Auth:** Admin Bearer Token + `X-SITE-*` Headers

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/surveys/:id/send` | Send survey link to customer (creates session & emails link) |
| `GET` | `/surveys/:id/sessions` | List all sessions for a specific survey |
| `GET` | `/surveys/:id/responses` | List completed responses for a survey |
| `GET` | `/surveys/:id/responses/:sessionId` | Get single response details by session ID |
| `DELETE` | `/surveys/:id/responses/:sessionId` | Delete a single response |
| `GET` | `/surveys/:id/responses/export` | Export responses (CSV / JSON format) |
| `GET` | `/surveys/responses` | Global responses list (across all surveys) |

---

### 🌐 3. Public Survey Fill (Customer Facing)
> **Auth:** Public / No Admin Auth. Requires `X-Survey-Token: <token>` header.

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/surveys/s/:token` | Load survey session, schema & partial responses |
| `PATCH` | `/surveys/s/:token/progress` | Auto-save / manual save partial survey progress |
| `POST` | `/surveys/s/:token/submit` | Submit completed survey & auto-generate CRM Lead |

---

### 👥 4. Lead & CRM Management
> **Auth:** Admin Bearer Token + `X-SITE-*` Headers

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/leads` | List leads (paginated, status filter, search, date range) |
| `GET` | `/leads/stats` | Lead counts breakdown by status (`new`, `contacted`, etc.) |
| `GET` | `/leads/:id` | Full lead detail with customer info, response & notes |
| `PUT` | `/leads/:id` | Update lead fields (status, assigned staff) |
| `PATCH` | `/leads/:id/status` | Update lead status & log to activity timeline |
| `PATCH` | `/leads/:id/assign` | Assign or re-assign lead to a staff member |
| `GET` | `/leads/:id/notes` | Get internal notes list for a lead |
| `POST` | `/leads/:id/notes` | Add a new internal note (logs `note_added` in activity) |
| `GET` | `/leads/:id/activity` | Get complete audit & timeline activity log |
