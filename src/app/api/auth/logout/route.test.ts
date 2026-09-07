import { describe, it, expect } from 'vitest';
import { POST, GET } from './route';

describe('API Route /api/auth/logout', () => {
  it('handles POST logout and clears session cookies', async () => {
    const res = await POST();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.status).toBe('SUCCESS');

    // Verify clear cookies were set
    const setCookieHeader = res.headers.get('set-cookie') || '';
    expect(setCookieHeader).toContain('token=');
    expect(setCookieHeader).toContain('Max-Age=0');
  });

  it('handles GET logout and clears session cookies', async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
