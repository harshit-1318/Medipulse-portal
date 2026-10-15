import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { User } from '@/lib/db/models/User';
import { ActivityLog } from '@/lib/db/models/ActivityLog';
import * as apiAuth from '@/lib/auth/apiAuth';

describe('GET /api/super-admin/dashboard-stats', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects unauthenticated requests with 401', async () => {
    const req = new Request('http://localhost:3000/api/super-admin/dashboard-stats');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('returns accurate database counts for authorized super admin', async () => {
    vi.spyOn(apiAuth, 'verifyApiAuth').mockResolvedValue({
      authorized: true,
      user: { isSuperAdmin: true, role: 'super_admin' } as any,
      errorResponse: null,
    });

    vi.spyOn(User, 'countDocuments').mockResolvedValue(8);
    vi.spyOn(ActivityLog, 'countDocuments').mockResolvedValue(580);

    const req = new Request('http://localhost:3000/api/super-admin/dashboard-stats');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.totalUsers).toBe(8);
    expect(json.data.totalActivities).toBe(580);
    expect(json.data.totalSites).toBe(1);
    expect(json.data.activeSites).toBe(1);
  });
});
