import { describe, it, expect } from 'vitest';
import { ROLES_TO_TEST } from '../fixtures';

const BASE_URL = 'http://localhost:3000';

function extractCookies(header: string | null): string {
  if (!header) return '';
  return header
    .split(/,\s*(?=[a-zA-Z0-9_-]+=)/)
    .map((c) => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');
}

describe('Live Localhost:3000 Multi-Phase Login & Authorization Automation', () => {
  // Phase 1: Super Admin
  describe('Phase 1: Super Admin Automation', () => {
    const superAdmin = ROLES_TO_TEST.find((r) => r.expectedRole === 'super_admin')!;

    it('authenticates, lands on /super-dashboard, and terminates session cleanly', async () => {
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: superAdmin.email, password: 'Password123!' }),
      });
      expect(loginRes.status).toBe(200);
      const cookies = extractCookies(loginRes.headers.get('set-cookie'));

      // Root path redirect
      const rootRes = await fetch(`${BASE_URL}/`, { headers: { Cookie: cookies }, redirect: 'manual' });
      expect(rootRes.headers.get('location')).toBe('/super-dashboard');

      // Dashboard access
      const dashRes = await fetch(`${BASE_URL}/super-dashboard`, { headers: { Cookie: cookies } });
      expect(dashRes.status).toBe(200);

      // Logout and session termination
      const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', headers: { Cookie: cookies } });
      expect(logoutRes.headers.get('set-cookie')).toContain('Max-Age=0');

      const postLogout = await fetch(`${BASE_URL}/super-dashboard`, { redirect: 'manual' });
      expect(postLogout.status).toBe(307);
      expect(postLogout.headers.get('location')).toContain('/login');
    });
  });

  // Phase 2: Admin
  describe('Phase 2: Admin Operations Automation', () => {
    const admin = ROLES_TO_TEST.find((r) => r.expectedRole === 'admin')!;

    it('authenticates, lands on /dashboard, blocks /super-dashboard, and logs out', async () => {
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: admin.email, password: 'Password123!' }),
      });
      expect(loginRes.status).toBe(200);
      const cookies = extractCookies(loginRes.headers.get('set-cookie'));

      // Root path redirect to /dashboard
      const rootRes = await fetch(`${BASE_URL}/`, { headers: { Cookie: cookies }, redirect: 'manual' });
      expect(rootRes.headers.get('location')).toBe('/dashboard');

      // Blocked from super-dashboard
      const superRes = await fetch(`${BASE_URL}/super-dashboard`, { headers: { Cookie: cookies }, redirect: 'manual' });
      expect(superRes.status).toBe(307);
      expect(superRes.headers.get('location')).toBe('/dashboard');

      // Logout
      const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', headers: { Cookie: cookies } });
      expect(logoutRes.headers.get('set-cookie')).toContain('Max-Age=0');
    });
  });

  // Phase 3: Other Roles
  describe('Phase 3: Standard & Clinical Roles Automation', () => {
    const otherRoles = ROLES_TO_TEST.filter((r) => r.expectedRole !== 'super_admin' && r.expectedRole !== 'admin');

    for (const testCase of otherRoles) {
      it(`verifies live login and dashboard routing for [${testCase.roleName}]`, async () => {
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testCase.email, password: 'Password123!' }),
        });
        expect(loginRes.status).toBe(200);
        const cookies = extractCookies(loginRes.headers.get('set-cookie'));

        const rootRes = await fetch(`${BASE_URL}/`, { headers: { Cookie: cookies }, redirect: 'manual' });
        expect(rootRes.headers.get('location')).toBe('/dashboard');

        const superRes = await fetch(`${BASE_URL}/super-dashboard`, { headers: { Cookie: cookies }, redirect: 'manual' });
        expect(superRes.status).toBe(307);

        await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', headers: { Cookie: cookies } });
      });
    }
  });
});
