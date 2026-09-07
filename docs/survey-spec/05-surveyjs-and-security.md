# 5. SurveyJS Integration & Security Considerations

---

## 5.1 SurveyJS Integration Notes

### CSS Isolation
Load SurveyJS CSS **only inside components that use it** — never in global stylesheets — to avoid Tailwind conflicts:

```ts
// SurveyBuilderPage.tsx — dynamically on mount to avoid SSR
import('survey-core/defaultV2.min.css');
import('survey-creator-core/survey-creator-core.min.css');

// PublicSurveyPage.tsx — loaded at component level
import 'survey-core/defaultV2.min.css';
```

### SSR Avoidance for SurveyJS Creator
The admin builder must be lazy-loaded via dynamic `import()` inside a `useEffect` and mounted with `createRoot` into a `ref` div. This avoids Astro/Next.js SSR build failures, as SurveyJS Creator accesses `window` and `document` on import.

### Schema Storage
SurveyJS Creator exports `creator.JSON` — a plain JS object. Store directly in MongoDB `schema` / `draftSchema` fields. No transformation needed.

### Partial Data Format
- SurveyJS partial answers: `survey.data` (plain object)
- Current page: `survey.currentPageNo` (0-based integer)
- Both are JSON-serialisable — send as-is in the PATCH body

### Version Trigger
Every `PUT /surveys/:id` call increments `currentVersion` and creates a `survey_versions` document. The toolbar "Save Draft" button triggers this.

---

## 5.2 Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Token guessing | 32-char cryptographically random alphanumeric (~190 bits entropy) |
| Duplicate submission | Session marked `completed` atomically; subsequent calls → `410 Gone` |
| Cross-tenant token exposure | All session lookups join on `siteId` from request headers; a token from Site A cannot resolve on Site B |
| Public endpoint abuse | Rate-limit `/surveys/s/*` (recommended: 10 req/min per IP) |
| Session expiry enforcement | Background job marks sessions `expired` where `expiresAt < now` and status is `pending` or `in_progress` |
| XSS from survey schema | SurveyJS sanitises rendered values; backend should strip HTML from `submittedResponse` values if displayed outside SurveyJS |
| CAPTCHA | Optional per-survey toggle in `settings.captchaEnabled` |
