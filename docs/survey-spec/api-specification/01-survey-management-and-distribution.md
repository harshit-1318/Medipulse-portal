# 3.1 & 3.2 API Specification: Survey Management & Distribution

### Base URL
```
/api/v1
```

### Authentication
- **Admin endpoints:** `Authorization: Bearer <jwt>` + `X-SITE-ID` + `X-SITE-KEY` + `X-SITE-HOST`
- **Public endpoints:** `X-Survey-Token: <sessionToken>` header only — no auth headers

### Response Envelope
```json
{ "status": "SUCCESS", "message": "...", "data": { ... } }
```

Paginated:
```json
{ "status": "SUCCESS", "data": { "items": [...], "total": 142, "page": 1, "limit": 20, "totalPages": 8 } }
```

---

## 3.1 Survey Management (Admin)

#### `GET /surveys`
List surveys. Query: `page`, `limit`, `status` (draft|published), `search`, `sortBy`, `sort`

#### `POST /surveys`
Body: `{ "title": "...", "description": "...", "schema": {} }`  
Backend auto-generates slug from title. Initial status always `draft`. Version 1 created automatically.

#### `GET /surveys/stats`
Returns aggregate statistics (`totalSurveys`, `draftSurveys`, `publishedSurveys`, `totalSessions`, `completedSessions`, `totalLeads`).

#### `GET /surveys/:id`
Full survey document including `schema`, `draftSchema`, `settings`.

#### `PUT /surveys/:id`
Update title, description, draftSchema, settings. Does NOT publish — only saves draft.  
Each call creates a new `survey_versions` entry and increments `currentVersion`.

#### `DELETE /surveys/:id`
Soft delete (`deletedAt` set). Returns `400` if survey has completed sessions.

#### `POST /surveys/:id/publish`
Body: `{ "changelog": "Optional note" }` — copies `draftSchema` → `schema`, sets `status: "published"`.

#### `POST /surveys/:id/unpublish`
Sets `status: "draft"`. Existing sessions are unaffected.

#### `POST /surveys/:id/duplicate`
Body: `{ "title": "Copy of ..." }` — creates a new draft survey.

#### `GET /surveys/:id/versions` & `GET /surveys/:id/versions/:versionNumber`
Version history and specific version schema retrieval.

#### `POST /surveys/:id/rollback/:versionNumber`
Body: `{ "publishImmediately": false }` — rolls `draftSchema` back to that version.

#### `PUT /surveys/:id/settings`
Body: `{ "expiryDays": 14, "captchaEnabled": true, "allowedDomains": ["example.com"], "submissionLimit": null }`

---

## 3.2 Survey Distribution (Admin)

#### `POST /surveys/:id/send`
Send survey to a specific customer. Survey must be `published`. Identified by `customerId`.

Business rules:
- Pending/in_progress session exists → returns `409 Conflict` with existing details
- Token: 32-char cryptographically random alphanumeric string
- Backend emails customer: `https://<host>/s/<token>`

#### `GET /surveys/:id/sessions`
List all sessions for a survey. Query: `page`, `limit`, `status`, `search` (customer name/email).
