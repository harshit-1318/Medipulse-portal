# MediPulse Healthcare Portal — Docman Jobs & Asynchronous Document Processing Architecture Report

**Document Version:** 1.0.0  
**Domain Scope:** Clinical PDF Generation, NHS GP Letters, Asynchronous Document Queuing, Idempotency  
**Framework Baseline:** Next.js 16 App Router · MongoDB Atlas · TypeScript · React 19  

---

## 1. Executive Summary

Healthcare delivery requires producing and dispatching legal medical documents (prescription certificates, cold-chain delivery notes, GP notification letters) to external healthcare providers (e.g. NHS GP Practices). Because generating high-resolution PDFs and sending them across external health APIs is resource-intensive and prone to transient network latency, MediPulse offloads these tasks to an **Asynchronous Docman Job Queue**.

Jobs are stored with strict **idempotency keys**, patient identifiers (`NHS-XXXXX`), cryptographic file hashes (`FileHash`), and recipient ODS codes (`RecipientOdsCode`).

---

## 2. Docman Job Processing Lifecycle

```
[Doctor Signs Rx / System Action] ──► [Create DocmanJob Record]
                                                 │
                                                 ▼
                                     [Idempotency Key Attached]
                                                 │
                                                 ▼
                                    [status: 'pending' in Mongo]
                                                 │
                                                 ▼
                                    [Background Worker Polling]
                                                 │
                                                 ▼
                                    [status: 'completed' / PDF Generated]
                                                 │
                                                 ▼
[Docman Dashboard UI] ◄── [JSON Response] ◄── [GET /api/docman-jobs]
```

### Step 1: Document Trigger
- Triggered when clinical staff approves an electronic prescription, generates an invoice summary, or sends a notification letter to a patient's registered General Practitioner.

### Step 2: Queue Payload Construction
- **File:** [`src/lib/db/models/DocmanJob.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/models/DocmanJob.ts)
- Payload structure includes:
  - `Patient`: `Identifier`, `FamilyName`, `GivenNames`, `BirthDate`, `Gender`, `Email`.
  - `Document`: `Description`, `EventDate`, `FileExtension` (`pdf`), `FileUrl`, `FileHash`, `ExternalSystemId`.
  - `RecipientOdsCode`: Recipient NHS practice organization code.
  - `GPData`: `organisation_code`, `gp_name`, `address`.

### Step 3: Worker Idempotency & Execution
- Jobs are assigned a `workerId` and transition from `pending` ➔ `processing` ➔ `completed`.
- If an error occurs, `lastError` is logged without data loss, allowing safe retries.
- Completed jobs store a `completed_at` ISO timestamp.

### Step 4: Docman Jobs Management (`GET /api/docman-jobs`)
- **File:** [`src/app/api/docman-jobs/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/docman-jobs/route.ts)
- Allows administrators and pharmacy staff to monitor queue throughput, filter by status (`pending`, `completed`, `failed`), and inspect document dispatch logs.

---

## 3. Verified File Map

| Component / Function | File Path | Line Range | Architectural Responsibility |
| :--- | :--- | :---: | :--- |
| **Docman Jobs Page** | `src/app/(dashboard)/docman-jobs/page.tsx` | L1-35 | Queue monitoring dashboard |
| **GET /api/docman-jobs**| `src/app/api/docman-jobs/route.ts` | L32-74 | Paginated query handler for document jobs |
| **DocmanJob Model** | `src/lib/db/models/DocmanJob.ts` | L1-81 | Mongoose schema with patient & GP payload |
