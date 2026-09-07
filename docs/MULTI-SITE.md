# Multi-Tenant Site Architecture — MediPulse Portal

## 1. Multi-Site Header Concept
`MediPulse Portal` operates in a multi-tenant environment where a single deployment serves multiple pharmacy and clinic websites. Every API call automatically includes site identification headers:

- `X-SITE-ID` — Unique database ID of the active site.
- `X-SITE-KEY` — Site API key.
- `X-SITE-HOST` — Active host domain (e.g., `portal.medipulse.co.uk`).

---

## 2. Dynamic Domain Detection Flow (`siteStore.ts`)

```text
Browser Navigation (window.location.host)
                  │
                  ▼
         Host Check:
         Is domain 'localhost'?
            ├── YES ──► Use Fallback Domain: 'portal.medipulse.co.uk'
            └── NO  ──► Use Actual Host Domain
                  │
                  ▼
         GET /sites/get-info-by-domain?host=<domain>
                  │
                  ▼
         Persist in localStorage & siteStore:
            X-SITE-ID   = siteInfo.id
            X-SITE-KEY  = siteInfo.key
            X-SITE-HOST = domain
                  │
                  ▼
         Apply Site Favicon (applySiteFavicon) & Sidebar Logo
```

---

## 3. Dynamic Site Branding
- Expanded sidebar logo loads `siteInfo.logo` (with static fallback).
- Collapsed sidebar icon loads `siteInfo.small_icon_url` (with static fallback `/favicon.svg`).
- Favicon dynamically updates in browser tab header upon site resolution.
