import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

import * as apiAuth from '@/lib/auth/apiAuth';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Order', () => ({
  Order: {
    countDocuments: vi.fn().mockResolvedValue(25),
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([{ _id: 'order_1', orderNumber: 'MP-101' }]),
        }),
      }),
    }),
  },
}));

vi.mock('@/lib/db/models/User', () => ({
  User: { countDocuments: vi.fn().mockResolvedValue(8) },
}));

vi.mock('@/lib/db/models/ActivityLog', () => ({
  ActivityLog: {
    countDocuments: vi.fn().mockResolvedValue(55),
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([{ _id: 'log_1', action: 'login_success' }]),
        }),
      }),
    }),
  },
}));

describe('Sites Dashboard Stats [id] API Route Handler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(apiAuth, 'verifyApiAuth').mockResolvedValue({
      authorized: true,
      user: { isSuperAdmin: true, role: 'super_admin' } as any,
      errorResponse: null,
    });
  });

  it('rejects unauthenticated requests with 401', async () => {
    vi.restoreAllMocks();
    const req = new Request('http://localhost:3000/api/sites/dashboard-stats/65e0123456789abcdef00001');
    const res = await GET(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(401);
  });

  it('GET returns 200 with stats, recentOrders, and recentActivities', async () => {
    const req = new Request('http://localhost:3000/api/sites/dashboard-stats/65e0123456789abcdef00001');
    const res = await GET(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.stats.orders).toBe(25);
    expect(json.stats.users).toBe(8);
    expect(json.stats.activities).toBe(55);
    expect(json.recentOrders.length).toBe(1);
    expect(json.recentActivities.length).toBe(1);
  });
});
