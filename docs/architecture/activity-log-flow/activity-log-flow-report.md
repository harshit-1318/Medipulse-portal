# MediPulse Healthcare Portal — Real-Time Audit Activity Logging Architecture Report

**Document Version:** 1.0.0  
**Domain Scope:** HIPAA Compliance Auditing, Immutable Activity Logs, Event Deduplication, Real-Time Filtering  
**Framework Baseline:** Next.js 16 App Router · MongoDB Atlas · React 19 · TypeScript  

---

## 1. Executive Summary

In healthcare environments handling prescription drugs and patient health data, an immutable, real-time audit trail is a strict regulatory and clinical requirement. The Activity Logging platform captures every security-sensitive action across MediPulse (logins, logouts, order status changes, prescription approvals, document generation).

The architecture features **non-blocking asynchronous dispatch**, **10-second duplicate click suppression**, and **hydration-safe query pipelines** with full filter parity across roles, action types, and date ranges.

---

## 2. Audit Logging & Query Architecture

```
[Clinical Action (Order, Login, Rx)] ──► [void recordActivity()]
                                                │
                                                ▼
                                    [10-Second Deduplication]
                                                │
                                                ▼
                                  [ActivityLog.create() in Mongo]
                                                │
                                                ▼
     [Activity Logs UI] ◄── [JSON Response] ◄── [GET /api/activity-log/list/filters]
```

### Step 1: Event Dispatchers
- **Triggers:**
  - Login / Logout: [`src/app/api/auth/login/route.ts:71`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/login/route.ts#L71) & [`src/app/api/auth/logout/route.ts:26`](file:///D:/New%20projects/1%20MediPulse/src/app/api/auth/logout/route.ts#L26).
  - Prescriptions: Approvals, reviews, doctor electronic signatures.
  - Orders: Marking urgent, parking, status updates.

### Step 2: Asynchronous Helper (`recordActivity`)
- **File:** [`src/lib/db/logActivityHelper.ts:4-37`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/logActivityHelper.ts#L4-L37)
- **Non-blocking:** Invoked with `void recordActivity({...})` so database log writes never delay UI response times.
- **Deduplication:**
  ```typescript
  const tenSecondsAgo = new Date(Date.now() - 10000);
  const recentDuplicate = await ActivityLog.findOne({
    user_email: email,
    action,
    createdAt: { $gte: tenSecondsAgo },
  });
  if (recentDuplicate) return;
  ```

### Step 3: MongoDB Atlas Schema
- **File:** [`src/lib/db/models/ActivityLog.ts`](file:///D:/New%20projects/1%20MediPulse/src/lib/db/models/ActivityLog.ts)
- Fields: `action`, `action_type`, `user`, `user_name`, `user_email`, `role`, `user_role`, `orderId`, `object_guid`, `details`, `page`, `view`, `createdAt`.

### Step 4: Real-Time Audit Query Pipeline (`GET /api/activity-log/list/filters`)
- **File:** [`src/app/api/activity-log/list/filters/route.ts`](file:///D:/New%20projects/1%20MediPulse/src/app/api/activity-log/list/filters/route.ts)
- Helper: `activityLogQueryBuilder.ts` parses date boundaries, role filters, and search terms into Mongoose queries.
- Guarantees active authenticated user session has a recent login entry.
- Paginated results with `total`, `page`, `limit` and `.lean()` query performance.

---

## 3. Verified File Map

| Component / Function | File Path | Line Range | Architectural Responsibility |
| :--- | :--- | :---: | :--- |
| **recordActivity Helper** | `src/lib/db/logActivityHelper.ts` | L4-37 | Asynchronous logger with 10s deduplication |
| **ActivityLog Schema** | `src/lib/db/models/ActivityLog.ts` | L1-35 | Immutable Mongoose audit log model |
| **Filter Query Route** | `src/app/api/activity-log/list/filters/route.ts` | L6-88 | Paginated query route for activity logs table |
| **activityLogQueryBuilder**| `.../filters/activityLogQueryBuilder.ts` | L1-80 | Parses URL filters into MongoDB query objects |
| **Activity Logs Page** | `src/app/(dashboard)/activity-logs/page.tsx` | L1-40 | Clinical audit viewer with role badges |
