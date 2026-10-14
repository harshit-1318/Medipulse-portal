import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/db/mongodb', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true),
}));

describe('Survey Responses List API Handler', () => {
  it('GET /api/surveys/responses returns 200 with items array and pagination', async () => {
    const req = new Request('http://localhost:3000/api/surveys/responses?page=1&limit=10');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBeGreaterThan(0);
    expect(json.items[0].customerEmail).toBe('oliver.smith@example.com');
  });
});
