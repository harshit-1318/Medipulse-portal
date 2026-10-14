import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

describe('Survey Specific Responses API Handler', () => {
  it('GET /api/surveys/[id]/responses returns 200 with responses for given survey', async () => {
    const req = new Request('http://localhost:3000/api/surveys/65e0123456789abcdef00001/responses');
    const res = await GET(req, { params: Promise.resolve({ id: '65e0123456789abcdef00001' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.items[0].surveyId).toBe('65e0123456789abcdef00001');
  });
});
