import { describe, it, expect } from 'vitest';
import { POST as loginRoute } from '@/app/api/auth/login/route';
import { POST as logoutRoute } from '@/app/api/auth/logout/route';
import { proxy } from '@/proxy';
import { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { ROLES_TO_TEST } from '../fixtures';
import { assertDashboardRouting, assertRouteAndApiPermissions } from '../helpers';

describe('Phase 4: Automated 5-Step Lifecycle Verification Across All 8 Roles', () => {
  for (const testCase of ROLES_TO_TEST) {
    describe(`Role Verification: [${testCase.roleName}] (${testCase.email})`, () => {
      let authToken: string;

      // 1. LOGIN
      it('1. Login: Authenticates credentials, generates JWT & dispatches session cookies', async () => {
        const req = new Request('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testCase.email, password: 'Password123!' }),
        });
        const res = await loginRoute(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.success).toBe(true);
        expect(data.data.user.email.toLowerCase()).toBe(testCase.email.toLowerCase());
        expect(data.data.user.effectiveRole.toLowerCase()).toBe(testCase.expectedRole.toLowerCase());

        authToken = data.data.token;
        expect(authToken).toBeDefined();

        const decoded = await verifyJwt(authToken);
        expect(decoded).not.toBeNull();
        expect(decoded?.email.toLowerCase()).toBe(testCase.email.toLowerCase());

        const setCookieHeader = res.headers.get('set-cookie') || '';
        expect(setCookieHeader).toContain('token=');
        expect(setCookieHeader).toContain('role=');
      }, 15000);

      // 2. DASHBOARD
      it('2. Dashboard: Lands on correct dashboard and enforces dashboard separation', () => {
        assertDashboardRouting(authToken, testCase.expectedRole, testCase.expectedRedirect);
      });

      // 3. PERMISSIONS (ROUTE GUARDS & BACKEND API)
      it('3. Permissions: Enforces route guards and backend API RBAC checks', async () => {
        await assertRouteAndApiPermissions(authToken, testCase.expectedRole, testCase.expectedRedirect);
      });

      // 4. LOGOUT
      it('4. Logout: Invalidates session cookies and prevents subsequent dashboard access', async () => {
        const logoutRes = await logoutRoute();
        expect(logoutRes.status).toBe(200);
        const setCookie = logoutRes.headers.get('set-cookie') || '';
        expect(setCookie).toContain('token=;');
        expect(setCookie).toContain('Max-Age=0');

        const unauthReq = new NextRequest(`http://localhost:3000${testCase.expectedRedirect}`);
        const unauthRes = proxy(unauthReq);
        expect(unauthRes.status).toBe(307);
        expect(new URL(unauthRes.headers.get('location')!).pathname).toBe('/login');
      });

      // 5. RE-LOGIN
      it('5. Re-Login: Re-authenticates successfully with same credentials', async () => {
        const reloginReq = new Request('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testCase.email, password: 'Password123!' }),
        });
        const reloginRes = await loginRoute(reloginReq);
        expect(reloginRes.status).toBe(200);
        const reloginData = await reloginRes.json();
        expect(reloginData.success).toBe(true);
        expect(reloginData.data.token).toBeDefined();
      });
    });
  }
});
