import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH as statusPATCH } from './status/route';
import { PATCH as assignPATCH } from './assign/route';
import { GET as notesGET, POST as notesPOST } from './notes/route';
import { GET as activityGET } from './activity/route';
import * as apiAuth from '@/lib/auth/apiAuth';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Lead', () => ({
  Lead: {
    findById: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: '65e0123456789abcdef00001',
        customerName: 'Oliver Twist',
        status: 'new',
        notes: [{ text: 'First note', createdAt: new Date() }],
        createdAt: new Date(),
      }),
    }),
    findByIdAndUpdate: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: '65e0123456789abcdef00001',
        status: 'qualified',
        assignedTo: { _id: 'u1', username: 'Super Admin' },
        updatedAt: new Date(),
      }),
    }),
  },
}));

vi.mock('@/lib/db/models/User', () => ({
  User: {
    findById: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'u1', name: 'Dr. John Watson' }),
    }),
    findOne: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    }),
  },
}));

describe('Lead Detail Sub-Routes', () => {
  const validId = '65e0123456789abcdef00001';

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
    const req = new Request('http://localhost:3000/api/leads/status', { method: 'PATCH' });
    const res = await statusPATCH(req, { params: Promise.resolve({ id: validId }) });
    expect(res.status).toBe(401);
  });

  it('PATCH /leads/[id]/status updates status', async () => {
    const req = new Request('http://localhost:3000/api/leads/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'qualified' }),
    });
    const res = await statusPATCH(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe('qualified');
  });

  it('PATCH /leads/[id]/assign assigns user', async () => {
    const validUserId = '65e0123456789abcdef00099';
    const req = new Request('http://localhost:3000/api/leads/assign', {
      method: 'PATCH',
      body: JSON.stringify({ userId: validUserId }),
    });
    const res = await assignPATCH(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.assignedTo.username).toBe('Dr. John Watson');
  });

  it('GET /leads/[id]/notes returns notes list', async () => {
    const req = new Request('http://localhost:3000/api/leads/notes');
    const res = await notesGET(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.items).toHaveLength(1);
  });

  it('POST /leads/[id]/notes adds a new note', async () => {
    const req = new Request('http://localhost:3000/api/leads/notes', {
      method: 'POST',
      body: JSON.stringify({ text: 'Customer requested evening callback' }),
    });
    const res = await notesPOST(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.text).toBe('Customer requested evening callback');
  });

  it('GET /leads/[id]/activity returns activity items', async () => {
    const req = new Request('http://localhost:3000/api/leads/activity');
    const res = await activityGET(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.items.length).toBeGreaterThan(0);
  });
});
