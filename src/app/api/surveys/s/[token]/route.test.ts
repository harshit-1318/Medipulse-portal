import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { PATCH } from './progress/route';
import { POST } from './submit/route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/db/models/Survey', () => ({
  Survey: {
    findById: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(null) }),
    findOne: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: '65e0123456789abcdef00001',
        title: 'GLP-1 Consultation Questionnaire',
        status: 'published',
        schema: { title: 'GLP-1 Assessment', pages: [] },
      }),
    }),
  },
}));

vi.mock('@/lib/db/models/Lead', () => ({
  Lead: {
    create: vi.fn().mockResolvedValue({ _id: 'lead123' }),
  },
}));

describe('Public Survey API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET returns 404 for invalid tokens', async () => {
    const req = new Request('http://localhost:3000/api/surveys/s/invalid-token');
    const res = await GET(req, { params: Promise.resolve({ token: 'invalid-token' }) });
    expect(res.status).toBe(404);
  });

  it('GET returns session data for valid token', async () => {
    const req = new Request('http://localhost:3000/api/surveys/s/valid-mock-token');
    const res = await GET(req, { params: Promise.resolve({ token: 'valid-mock-token' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.surveyTitle).toBe('GLP-1 Consultation Questionnaire');
  });

  it('PATCH progress returns saved status', async () => {
    const req = new Request('http://localhost:3000/api/surveys/s/token123/progress', {
      method: 'PATCH',
      body: JSON.stringify({ partialResponse: { step: 1 }, currentPage: 1 }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ token: 'token123' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.saved).toBe(true);
  });

  it('POST submit completes survey and creates lead', async () => {
    const req = new Request('http://localhost:3000/api/surveys/s/token123/submit', {
      method: 'POST',
      body: JSON.stringify({
        submittedResponse: { customerName: 'Emma Watson', customerEmail: 'emma@example.com' },
      }),
    });
    const res = await POST(req, { params: Promise.resolve({ token: 'token123' }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.submitted).toBe(true);
  });
});
