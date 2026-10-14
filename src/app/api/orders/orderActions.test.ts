import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as cancelPOST } from './cancel/route';
import { POST as docReminderPOST } from './[id]/document-reminder/route';
import { POST as rxReminderPOST } from './[id]/prescription-reminder/route';
import { POST as messagePOST } from './[id]/message/route';
import { POST as gpEmailPOST } from './[id]/gp-email/route';
import { POST as ageVerificationPOST } from './[id]/age-verification/route';
import { POST as sixMonthPOST } from './[id]/six-month-review/route';
import { GET as createRoomGET } from '../video/create-room/[id]/route';
import { GET as createInPersonGET } from '../video/create-in-person-room/[id]/route';
import { GET as recordingsGET } from '../video/recordings/by-order/[id]/route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Order', () => ({
  Order: {
    findOneAndUpdate: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: 'ord123',
        orderNumber: '#MP-1001',
        status: 'cancelled',
      }),
    }),
  },
}));

describe('Order Actions & Video API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /orders/cancel updates order to cancelled', async () => {
    const req = new Request('http://localhost:3000/api/orders/cancel', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'MP-1001', reason: 'Customer requested' }),
    });
    const res = await cancelPOST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Order cancelled successfully');
  });

  it('POST /orders/[id]/document-reminder sends reminder', async () => {
    const req = new Request('http://localhost:3000/api/orders/1001/document-reminder', { method: 'POST' });
    const res = await docReminderPOST(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('POST /orders/[id]/prescription-reminder sends reminder', async () => {
    const req = new Request('http://localhost:3000/api/orders/1001/prescription-reminder', { method: 'POST' });
    const res = await rxReminderPOST(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('POST /orders/[id]/message sends customer message', async () => {
    const req = new Request('http://localhost:3000/api/orders/1001/message', {
      method: 'POST',
      body: JSON.stringify({ message: 'Your prescription is ready' }),
    });
    const res = await messagePOST(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('POST /orders/[id]/gp-email sends email to GP', async () => {
    const req = new Request('http://localhost:3000/api/orders/1001/gp-email', {
      method: 'POST',
      body: JSON.stringify({ gp_email: 'clinic@nhs.net', message: 'Patient commenced on GLP-1' }),
    });
    const res = await gpEmailPOST(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('POST /orders/[id]/age-verification triggers verification', async () => {
    const req = new Request('http://localhost:3000/api/orders/1001/age-verification', { method: 'POST' });
    const res = await ageVerificationPOST(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('POST /orders/[id]/six-month-review triggers review', async () => {
    const req = new Request('http://localhost:3000/api/orders/1001/six-month-review', { method: 'POST' });
    const res = await sixMonthPOST(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('GET /video/create-room/[id] returns video room URL', async () => {
    const req = new Request('http://localhost:3000/api/video/create-room/1001');
    const res = await createRoomGET(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.roomUrl).toContain('meet.medipulse.io');
  });

  it('GET /video/create-in-person-room/[id] returns in-person room URL', async () => {
    const req = new Request('http://localhost:3000/api/video/create-in-person-room/1001');
    const res = await createInPersonGET(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.roomUrl).toContain('meet.medipulse.io/in-person');
  });

  it('GET /video/recordings/by-order/[id] returns recordings array', async () => {
    const req = new Request('http://localhost:3000/api/video/recordings/by-order/1001');
    const res = await recordingsGET(req, { params: Promise.resolve({ id: '1001' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.recordings).toEqual([]);
  });
});
