import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from './route';
import * as apiAuth from '@/lib/auth/apiAuth';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Order', () => ({
  Order: { countDocuments: vi.fn().mockResolvedValue(42) },
}));

vi.mock('@/lib/db/models/User', () => ({
  User: { countDocuments: vi.fn().mockResolvedValue(10) },
}));

vi.mock('@/lib/db/models/ActivityLog', () => ({
  ActivityLog: { countDocuments: vi.fn().mockResolvedValue(120) },
}));

describe('Sites [id] API Route Handler', () => {
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
    const req = new Request('http://localhost:3000/api/sites/65e0123456789abcdef00001');
    const res = await GET(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(401);
  });

  it('GET /api/sites/[id] returns 200 with site object and live counts', async () => {
    const req = new Request('http://localhost:3000/api/sites/65e0123456789abcdef00001');
    const res = await GET(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.site.name).toBe('MediPulse Healthcare Portal');
    expect(json.data.site.totalOrders).toBe(42);
    expect(json.data.site.totalUsers).toBe(10);
    expect(json.data.site.totalActivities).toBe(120);
  });

  it('PATCH /api/sites/[id] returns 200 with updated fields', async () => {
    const req = new Request('http://localhost:3000/api/sites/65e0123456789abcdef00001', {
      method: 'PATCH',
      body: JSON.stringify({ product_ids: ['prod_1', 'prod_2'] }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.siteId).toBe('65e0123456789abcdef00001');
  });
});
