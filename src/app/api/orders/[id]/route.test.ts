import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Order', () => ({
  Order: {
    findOne: vi.fn().mockImplementation((query: any) => ({
      lean: vi.fn().mockResolvedValue(
        query?.$or?.some((cond: any) => cond.orderNumber === 'MP-12345')
          ? {
              _id: '65e0123456789abcdef00001',
              orderNumber: 'MP-12345',
              customerName: 'Oliver Smith',
              status: 'fulfilled',
            }
          : null
      ),
    })),
  },
}));

describe('Order [id] API Route Handler', () => {
  it('returns 404 when order is not found in database', async () => {
    const req = new Request('http://localhost:3000/api/orders/nonexistent-99999');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent-99999' }) });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Order not found');
  });

  it('returns 200 with order payload when order is found', async () => {
    const req = new Request('http://localhost:3000/api/orders/MP-12345');
    const res = await GET(req, { params: Promise.resolve({ id: 'MP-12345' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.order_name).toBe('MP-12345');
    expect(json.data.customer.name).toBe('Oliver Smith');
  });
});
