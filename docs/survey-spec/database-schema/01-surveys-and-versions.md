# 2.1 & 2.2 Database Schema: Surveys & Survey Versions

## 2.1 `surveys`

Stores survey definitions, draft and published schemas, and settings.

```json
{
  "_id": "ObjectId",
  "siteId": "ObjectId",
  "title": "Weight Loss Onboarding",
  "description": "Optional",
  "slug": "weight-loss-onboarding",
  "status": "draft",
  "currentVersion": 3,
  "schema": {},
  "draftSchema": {},
  "settings": {
    "expiryDays": 7,
    "captchaEnabled": false,
    "allowedDomains": [],
    "submissionLimit": null
  },
  "createdBy": "ObjectId",
  "updatedBy": "ObjectId",
  "createdAt": "ISO",
  "updatedAt": "ISO",
  "deletedAt": null
}
```

**Indexes:** `siteId`, `slug` (unique within site), `status`, `createdAt`

---

## 2.2 `survey_versions`

Maintains full version history for auditing and rollback capabilities.

```json
{
  "_id": "ObjectId",
  "siteId": "ObjectId",
  "surveyId": "ObjectId",
  "versionNumber": 3,
  "schema": {},
  "changelog": "Added medication history page",
  "createdBy": "ObjectId",
  "createdAt": "ISO"
}
```

**Indexes:** `surveyId`, `versionNumber`, `siteId`
