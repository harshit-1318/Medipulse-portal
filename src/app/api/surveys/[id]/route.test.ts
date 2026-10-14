import { describe, it, expect, vi } from 'vitest';
import { GET, PUT, DELETE } from './route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Survey', () => ({
  Survey: {
    findById: vi.fn().mockImplementation((id: string) => ({
      lean: vi.fn().mockResolvedValue(id === '65e0123456789abcdef00001' ? { _id: id, title: 'Health Assessment' } : null),
    })),
    findByIdAndUpdate: vi.fn().mockImplementation((id: string, body: any) => ({
      lean: vi.fn().mockResolvedValue({ _id: id, ...body }),
    })),
    findByIdAndDelete: vi.fn().mockResolvedValue({}),
  },
}));

describe('Survey [id] API Route Handlers', () => {
  it('GET returns 404 for malformed/non-ObjectId string', async () => {
    const req = new Request('http://localhost:3000/api/surveys/invalid-id-xyz');
    const res = await GET(req, { params: Promise.resolve({ id: 'invalid-id-xyz' }) });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Survey not found');
  });

  it('GET returns 200 for existing valid survey id', async () => {
    const req = new Request('http://localhost:3000/api/surveys/65e0123456789abcdef00001');
    const res = await GET(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.title).toBe('Health Assessment');
  });

  it('PUT returns 404 for invalid survey id', async () => {
    const req = new Request('http://localhost:3000/api/surveys/invalid-id', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Updated' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: 'invalid-id' }) });
    expect(res.status).toBe(404);
  });

  it('DELETE returns 404 for invalid survey id', async () => {
    const req = new Request('http://localhost:3000/api/surveys/invalid-id', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'invalid-id' }) });
    expect(res.status).toBe(404);
  });
});
