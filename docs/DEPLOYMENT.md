# Production Deployment Guide — MediPulse Portal

## 1. Environment Setup
Configure production environment variables in your deployment environment (Vercel, Heroku, or Docker/Node container):

```bash
# Primary API Base URL
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-domain.com
SERVER_API_BASE_URL=https://your-backend-api-domain.com

# Multi-Tenant Defaults
NEXT_PUBLIC_DEFAULT_SITE_HOST=portal.medipulse.co.uk
NEXT_PUBLIC_SURVEY_TOKEN_HEADER=X-Survey-Token

# Feature Flags
NEXT_PUBLIC_AUTO_RESYNC=true

# Auth Cookie Name
AUTH_COOKIE_NAME=token
```

---

## 2. Build Verification & Deployment

### Step 1: Typecheck Verification
```bash
npm run typecheck
```

### Step 2: Test Suite Execution
```bash
npm test
```

### Step 3: Production Build Generation
```bash
npm run build
```

### Step 4: Launch Production Server
```bash
npm run start
```

---

## 3. Node.js Engine Requirements
- Node.js version: `>= 20.0.0`
- Recommended hosting platform: Vercel / Heroku Container / AWS Amplify
