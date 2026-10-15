import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as publishPOST } from './publish/route';
import { POST as unpublishPOST } from './unpublish/route';
import { POST as duplicatePOST } from './duplicate/route';
import { PUT as settingsPUT } from './settings/route';
import { POST as sendPOST } from './send/route';
import { GET as versionsGET } from './versions/route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Survey', () => ({
  Survey: {
    findById: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: '65e0123456789abcdef00001',
        title: 'GLP-1 Assessment',
        slug: 'glp-1-assessment',
        status: 'draft',
        currentVersion: 1,
        schema: {},
        settings: { expiryDays: 7 },
      }),
    }),
    findByIdAndUpdate: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: '65e0123456789abcdef00001',
        title: 'GLP-1 Assessment',
        status: 'published',
      }),
    }),
    create: vi.fn().mockResolvedValue({
      _id: '65e0123456789abcdef00002',
      title: 'Copy of GLP-1 Assessment',
      toObject: () => ({ _id: '65e0123456789abcdef00002', title: 'Copy of GLP-1 Assessment' }),
    }),
  },
}));

describe('Survey Management Endpoints', () => {
  const validId = '65e0123456789abcdef00001';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('publish sets status to published', async () => {
    const req = new Request('http://localhost:3000/api/surveys/publish', { method: 'POST' });
    const res = await publishPOST(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.status).toBe('published');
  });

  it('unpublish sets status to draft', async () => {
    const req = new Request('http://localhost:3000/api/surveys/unpublish', { method: 'POST' });
    const res = await unpublishPOST(req, { params: Promise.resolve({ id: validId }) });
    expect(res.status).toBe(200);
  });

  it('duplicate clones survey', async () => {
    const req = new Request('http://localhost:3000/api/surveys/duplicate', {
      method: 'POST',
      body: JSON.stringify({ title: 'Copy of GLP-1 Assessment' }),
    });
    const res = await duplicatePOST(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.title).toBe('Copy of GLP-1 Assessment');
  });

  it('settings updates configuration', async () => {
    const req = new Request('http://localhost:3000/api/surveys/settings', {
      method: 'PUT',
      body: JSON.stringify({ expiryDays: 14 }),
    });
    const res = await settingsPUT(req, { params: Promise.resolve({ id: validId }) });
    expect(res.status).toBe(200);
  });

  it('send returns session token and link', async () => {
    const req = new Request('http://localhost:3000/api/surveys/send', {
      method: 'POST',
      body: JSON.stringify({ customerEmail: 'patient@example.com' }),
    });
    const res = await sendPOST(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.surveyLink).toContain('/s/');
  });

  it('versions returns version history', async () => {
    const req = new Request('http://localhost:3000/api/surveys/versions');
    const res = await versionsGET(req, { params: Promise.resolve({ id: validId }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.total).toBeGreaterThan(0);
  });
});
