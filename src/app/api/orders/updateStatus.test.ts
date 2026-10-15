import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiAuth from '@/lib/auth/apiAuth';
import { POST } from './update-status/route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Order', () => ({
  Order: {
    findOneAndUpdate: vi.fn().mockImplementation((query: any, update: any) => ({
      lean: vi.fn().mockResolvedValue({
        _id: 'ord123',
        orderNumber: 'MP-95478',
        shopify_order_id: '6592679402',
        ...update,
      }),
    })),
  },
}));

describe('POST /api/orders/update-status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(apiAuth, 'verifyApiAuth').mockResolvedValue({
      authorized: true,
      user: { role: 'admin' } as any,
      errorResponse: null,
    });
  });

  it('updates order to on_hold when mark_on_hold is passed', async () => {
    const req = new Request('http://localhost:3000/api/orders/update-status', {
      method: 'POST',
      body: JSON.stringify({ order_id: '6592679402', mark_on_hold: '1' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('on_hold');
    expect(data.data.fulfillment_status).toBe('on_hold');
  });

  it('updates fulfillment_status directly when provided', async () => {
    const req = new Request('http://localhost:3000/api/orders/update-status', {
      method: 'POST',
      body: JSON.stringify({ order_id: '6592679402', fulfillment_status: 'fulfilled', status: 'completed' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.fulfillment_status).toBe('fulfilled');
  });
});
