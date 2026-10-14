import { describe, it, expect, vi } from 'vitest';
import { GET, PATCH, DELETE } from './route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Lead', () => ({
  Lead: {
    findById: vi.fn().mockImplementation((id: string) => ({
      lean: vi.fn().mockResolvedValue(id === '65e0123456789abcdef00001' ? { _id: id, customerName: 'Emma Watson', status: 'new' } : null),
    })),
    findByIdAndUpdate: vi.fn().mockImplementation((id: string, body: any) => ({
      lean: vi.fn().mockResolvedValue({ _id: id, ...body }),
    })),
    findByIdAndDelete: vi.fn().mockResolvedValue({}),
  },
}));

describe('Leads [id] API Route Handler', () => {
  it('GET returns 404 for non-ObjectId string', async () => {
    const req = new Request('http://localhost:3000/api/leads/invalid-lead-id');
    const res = await GET(req, { params: Promise.resolve({ id: 'invalid-lead-id' }) });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it('GET returns 200 for valid existing lead id', async () => {
    const req = new Request('http://localhost:3000/api/leads/65e0123456789abcdef00001');
    const res = await GET(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.customerName).toBe('Emma Watson');
  });

  it('PATCH returns 200 with updated fields', async () => {
    const req = new Request('http://localhost:3000/api/leads/65e0123456789abcdef00001', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'contacted' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(200);
  });

  it('DELETE returns 200 with deleted ID confirmation', async () => {
    const req = new Request('http://localhost:3000/api/leads/65e0123456789abcdef00001', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(200);
  });
});
