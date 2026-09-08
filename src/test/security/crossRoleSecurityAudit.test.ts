import { describe, it, expect, afterAll } from 'vitest';
import { POST as loginRoute } from '@/app/api/auth/login/route';
import { POST as logoutRoute } from '@/app/api/auth/logout/route';
import { proxy } from '@/proxy';
import { NextRequest } from 'next/server';
import { ROLES_TO_TEST, ROLE_RESTRICTION_MATRIX } from '../fixtures';
import { verifyRestrictedApiOperations } from '../helpers';

describe('Phase 5 & 6: Cross-Role RBAC Security Matrix Audit', () => {
  for (const roleA of ROLES_TO_TEST) {
    describe(`Cross-Role Security Matrix: [${roleA.roleName}] (${roleA.email})`, () => {
      let tokenA: string;
      const matrix = ROLE_RESTRICTION_MATRIX[roleA.expectedRole];

      it(`1. Authenticates ${roleA.roleName} cleanly`, async () => {
        const req = new Request('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: roleA.email, password: 'Password123!' }),
        });
        const res = await loginRoute(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.success).toBe(true);
        tokenA = data.data.token;
        expect(tokenA).toBeDefined();
      }, 15000);

      it(`2. Blocks direct URL navigation to forbidden routes for ${roleA.roleName}`, () => {
        for (const forbiddenPath of matrix.forbiddenRoutes) {
          const req = new NextRequest(`http://localhost:3000${forbiddenPath}`);
          req.cookies.set('token', tokenA);
          req.cookies.set('role', roleA.expectedRole);
          const res = proxy(req);
          expect(res.status).toBe(307);
          expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
        }
      });

      it(`3. Permits access to authorized routes for ${roleA.roleName}`, () => {
        for (const allowedPath of matrix.allowedRoutes) {
          const req = new NextRequest(`http://localhost:3000${allowedPath}`);
          req.cookies.set('token', tokenA);
          req.cookies.set('role', roleA.expectedRole);
          const res = proxy(req);
          if (allowedPath === '/orders') {
            expect(res.status).toBe(307);
            expect(res.headers.get('location')).toContain('/orders/all');
          } else {
            expect(res.status).toBe(200);
          }
        }
      });

      it(`4. Rejects restricted API operations for ${roleA.roleName} at backend level`, async () => {
        await verifyRestrictedApiOperations(tokenA, roleA.expectedRole === 'super_admin');
      });

      it(`5. Terminates session on logout and blocks access to ${roleA.roleName}`, async () => {
        const logoutRes = await logoutRoute();
        expect(logoutRes.status).toBe(200);
        const setCookie = logoutRes.headers.get('set-cookie') || '';
        expect(setCookie).toContain('token=;');
        expect(setCookie).toContain('Max-Age=0');

        const postLogoutReq = new NextRequest(`http://localhost:3000${roleA.expectedRedirect}`);
        const postLogoutRes = proxy(postLogoutReq);
        expect(postLogoutRes.status).toBe(307);
        expect(new URL(postLogoutRes.headers.get('location')!).pathname).toBe('/login');
      });
    });
  }

  afterAll(async () => {
    try {
      const { User } = await import('@/lib/db/models/User');
      await User.deleteMany({ email: { $regex: /^injected_/i } });
    } catch {
      // Ignored if test env is already torn down
    }
  });
});
