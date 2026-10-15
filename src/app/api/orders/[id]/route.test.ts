import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Order', () => ({
  Order: {
    findOne: vi.fn().mockImplementation((query: any) => ({
      lean: vi.fn().mockImplementation(() => {
        const isMatch = (num: string) => query?.$or?.some((c: any) => c.orderNumber === num || c.shopify_order_id === num);
        if (isMatch('MP-12345')) {
          return Promise.resolve({
            _id: '65e0123456789abcdef00001',
            orderNumber: 'MP-12345',
            customerName: 'Oliver Smith',
            status: 'completed',
            fulfillment_status: 'fulfilled',
          });
        }
        if (isMatch('MP-95478') || isMatch('6592679402')) {
          return Promise.resolve({
            _id: '6ad0940b7b04b95309215c34',
            orderNumber: 'MP-95478',
            shopify_order_id: '6592679402',
            customerName: 'Mia Miller',
            status: 'pending_doctor_approval',
            fulfillment_status: 'unfulfilled',
          });
        }
        return Promise.resolve(null);
      }),
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
  });

  it('returns 200 with unfulfilled status and null customer documents for unfulfilled orders without uploads', async () => {
    const req = new Request('http://localhost:3000/api/orders/6592679402');
    const res = await GET(req, { params: Promise.resolve({ id: '6592679402' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.order_name).toBe('MP-95478');
    expect(json.data.fulfillment_status).toBe('unfulfilled');
    expect(json.data.status).toBe('pending_doctor_approval');
    expect(json.data.customerDocuments.id_card).toBeNull();
    expect(json.data.customerDocuments.full_photo).toBeNull();
    expect(json.data.customerDocuments.video_recordings).toEqual([]);
    expect(json.data.consultationFlags.has_id_card).toBe(false);
    expect(json.data.consultationFlags.has_full_photo).toBe(false);
    expect(json.data.consultationFlags.has_video_recording).toBe(false);
  });

  it('returns 200 with fulfilled status for fulfilled orders', async () => {
    const req = new Request('http://localhost:3000/api/orders/MP-12345');
    const res = await GET(req, { params: Promise.resolve({ id: 'MP-12345' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.fulfillment_status).toBe('fulfilled');
  });
});
