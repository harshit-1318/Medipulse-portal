import { describe, it, expect } from 'vitest';
import { verifyApiAuth } from '../apiAuth';
import { signJwt } from '../jwt';


const reqWith = (headers: Record<string, string> = {}) =>
  new Request('http://localhost:3000/api/orders', { headers });

const tokenFor = (sub: string, role: string, extra: Record<string, unknown> = {}) =>
  signJwt({ sub, email: `${role}@test.com`, role, effectiveRole: role, ...extra });

describe('verifyApiAuth (src/lib/auth/apiAuth.ts)', () => {
  it('returns 401 when token is missing', async () => {
    const res = await verifyApiAuth(reqWith());
    expect(res.authorized).toBe(false);
    expect(res.user).toBeNull();
    expect(res.errorResponse?.status).toBe(401);
  });

  it('returns 401 when token is invalid or expired', async () => {
    const res = await verifyApiAuth(reqWith({ Authorization: 'Bearer invalid.token' }));
    expect(res.authorized).toBe(false);
    expect(res.errorResponse?.status).toBe(401);
  });

  it('authorizes valid Bearer token', async () => {
    const token = await tokenFor('u1', 'prescriber');
    const res = await verifyApiAuth(reqWith({ Authorization: `Bearer ${token}` }));
    expect(res.authorized).toBe(true);
    expect(res.user?.email).toBe('prescriber@test.com');
    expect(res.errorResponse).toBeNull();
  });

  it('authorizes valid token from cookie header', async () => {
    const token = await tokenFor('u2', 'admin');
    const res = await verifyApiAuth(reqWith({ Cookie: `token=${token}; other=1` }));
    expect(res.authorized).toBe(true);
    expect(res.user?.role).toBe('admin');
  });

  it('returns 403 when role is not in requiredRoles', async () => {
    const token = await tokenFor('u3', 'driver');
    const res = await verifyApiAuth(reqWith({ Authorization: `Bearer ${token}` }), {
      requiredRoles: ['prescriber', 'pharmacist', 'admin'],
    });
    expect(res.authorized).toBe(false);
    expect(res.errorResponse?.status).toBe(403);
  });

  it('allows super_admin even if role is not in requiredRoles', async () => {
    const token = await tokenFor('u4', 'super_admin', { isSuperAdmin: true });
    const res = await verifyApiAuth(reqWith({ Authorization: `Bearer ${token}` }), {
      requiredRoles: ['prescriber'],
    });
    expect(res.authorized).toBe(true);
  });

  it('returns 403 when requireSuperAdmin is true and user is not super_admin', async () => {
    const token = await tokenFor('u5', 'admin');
    const res = await verifyApiAuth(reqWith({ Authorization: `Bearer ${token}` }), {
      requireSuperAdmin: true,
    });
    expect(res.authorized).toBe(false);
    expect(res.errorResponse?.status).toBe(403);
  });
});
