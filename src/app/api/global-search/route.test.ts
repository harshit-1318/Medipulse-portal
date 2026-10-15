import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import * as apiAuth from '@/lib/auth/apiAuth';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Order', () => ({
  Order: {
    find: vi.fn().mockReturnValue({
      limit: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          {
            _id: 'ord1',
            orderNumber: '#MP-1001',
            shopify_order_id: 1001,
            customerEmail: 'alice@example.com',
            customerName: 'Alice Smith',
            status: 'unfulfilled',
            createdAt: new Date('2026-08-01T00:00:00Z'),
          },
        ]),
      }),
    }),
  },
}));

vi.mock('@/lib/db/models/Customer', () => ({
  Customer: {
    find: vi.fn().mockReturnValue({
      limit: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          {
            _id: 'cust1',
            customerId: '101',
            name: 'Alice Smith',
            email: 'alice@example.com',
          },
        ]),
      }),
    }),
  },
}));

describe('GET /api/global-search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(apiAuth, 'verifyApiAuth').mockResolvedValue({
      authorized: true,
      user: { role: 'admin' } as any,
      errorResponse: null,
    });
  });

  it('rejects unauthenticated requests with 401', async () => {
    vi.restoreAllMocks();
    const req = new Request('http://localhost:3000/api/global-search?q=alice');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('returns empty results when query length is less than 2', async () => {
    const req = new Request('http://localhost:3000/api/global-search?q=a');
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({ orders: [], customers: [] });
  });

  it('searches orders and customers when valid query is provided', async () => {
    const req = new Request('http://localhost:3000/api/global-search?q=alice');
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.orders).toHaveLength(1);
    expect(data.orders[0].order_name).toBe('#MP-1001');
    expect(data.customers).toHaveLength(1);
    expect(data.customers[0].email).toBe('alice@example.com');
  });
});
