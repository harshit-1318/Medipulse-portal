# 2.3 & 2.4 Database Schema: Survey Sessions & Leads

## 2.3 `survey_sessions`

Links individual customers to unique survey sends. Tracks progress, partial responses, and submission tokens.

```json
{
  "_id": "ObjectId",
  "siteId": "ObjectId",
  "surveyId": "ObjectId",
  "customerId": "ObjectId",
  "orderId": "ObjectId | null",
  "token": "a8f3k2m9n1p4q7r0s5t6u2v3abcd1234",
  "status": "pending | in_progress | completed | expired",
  "partialResponse": null,
  "currentPage": 0,
  "submittedResponse": null,
  "submittedAt": null,
  "metadata": {
    "ipAddress": "1.2.3.4",
    "userAgent": "Mozilla/5.0...",
    "source": "email | direct | embed",
    "submittedFrom": "https://..."
  },
  "expiresAt": "ISO",
  "sentBy": "ObjectId",
  "sentAt": "ISO",
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

**Indexes:** `token` (unique), `siteId`, `surveyId`, `customerId`, `status`, `expiresAt`

---

## 2.4 `leads`

Automatically created upon completed survey submissions for CRM workflow tracking.

```json
{
  "_id": "ObjectId",
  "siteId": "ObjectId",
  "surveyId": "ObjectId",
  "sessionId": "ObjectId",
  "customerId": "ObjectId",
  "orderId": "ObjectId | null",
  "status": "new | contacted | qualified | closed | lost",
  "assignedTo": null,
  "notes": [
    {
      "_id": "ObjectId",
      "text": "Patient called back",
      "createdBy": "ObjectId",
      "createdAt": "ISO"
    }
  ],
  "activityLog": [
    {
      "action": "created | status_changed | assigned | note_added",
      "from": null,
      "to": "new",
      "performedBy": "ObjectId",
      "timestamp": "ISO"
    }
  ],
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

**Indexes:** `siteId`, `surveyId`, `customerId`, `status`, `assignedTo`, `createdAt`
