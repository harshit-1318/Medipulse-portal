# 3.3 & 3.4 API Specification: Public Fill & Survey Responses

## 3.3 Public Survey Fill (No Auth — Customer-Facing)

> Authentication is via `X-Survey-Token` header only. Customer is identified by the token alone.

#### `GET /surveys/s/:token`
Load session + survey schema + partial data.

Business rules:
- `status === "completed"` → `410 Gone` with `{ "alreadySubmitted": true }`
- `status === "expired"` or `expiresAt < now` → `410 Gone` with `{ "expired": true }`
- `status === "pending"` → atomically set `status = "in_progress"`
- Returns **published** schema only (never draft)

Response shape:
```json
{
  "sessionId": "...", "status": "in_progress",
  "surveyTitle": "Weight Loss Onboarding",
  "schema": { "/* SurveyJS JSON */": "" },
  "partialResponse": null,
  "currentPage": 0,
  "expiresAt": "..."
}
```

#### `PATCH /surveys/s/:token/progress`
Save partial progress (auto-save or explicit "Save & Continue Later").  
Only accepted when `status === "in_progress"`. Does NOT mark as complete.

Body: `{ "partialResponse": { "/* SurveyJS partial data */": "" }, "currentPage": 2 }`  
Response: `{ "saved": true, "savedAt": "..." }`

#### `POST /surveys/s/:token/submit`
Submit the completed survey.

Business rules:
- Rejects if status is not `in_progress` (410 for completed/expired)
- Sets `status = "completed"`, records `submittedAt`, captures `metadata.ipAddress` from request
- Clears `partialResponse`
- **Atomically creates a `leads` record** with `status: "new"` — no separate admin action needed
- Token cannot be reused after completion

Response: `{ "submitted": true, "submittedAt": "...", "message": "Thank you! Your response has been recorded." }`

---

## 3.4 Survey Responses (Admin)

#### `GET /surveys/:id/responses`
Paginated completed sessions. Query: `page`, `limit`, `search`, `from`, `to`, `sortBy`, `sort`

#### `GET /surveys/:id/responses/:sessionId`
Full response including `submittedResponse` JSON.

#### `DELETE /surveys/:id/responses/:sessionId`
Soft delete response + linked lead.

#### `GET /surveys/:id/responses/export`
Query: `format` (csv|json), `from`, `to`  
Response: file download `Content-Disposition: attachment; filename="survey-responses-<slug>-<date>.csv"`

#### `GET /surveys/responses`
All responses across all surveys (same shape + `survey.title` per item).
