import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';
import { signJwt, verifyJwt } from '@/lib/auth/jwt';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

describe('Special Security Check: Anti-Tampering & Privilege Escalation Defenses', () => {
  it('rejects tampered JWT token attempting role escalation to super_admin', async () => {
    const validCustomerToken = await signJwt({
      sub: 'cust_123',
      email: 'attacker@medipulse.io',
      role: 'customer',
      effectiveRole: 'customer',
      isSuperAdmin: false,
      site_id: '65e0123456789abcdef00001',
    });

    const [header, payload, sig] = validCustomerToken.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    decoded.role = 'super_admin';
    decoded.effectiveRole = 'super_admin';
    decoded.isSuperAdmin = true;
    const forgedPayload = Buffer.from(JSON.stringify(decoded)).toString('base64url');
    const forgedToken = `${header}.${forgedPayload}.${sig}`;

    // 1. Cryptographic signature verification MUST reject the forged token
    const verified = await verifyJwt(forgedToken);
    expect(verified).toBeNull();

    // 2. Backend API must reject forged token with 401 Unauthorized
    const apiReq = new Request('http://localhost:3000/api/users', {
      headers: { Authorization: `Bearer ${forgedToken}` },
    });
    const auth = await verifyApiAuth(apiReq, { requireSuperAdmin: true });
    expect(auth.authorized).toBe(false);
    expect(auth.errorResponse?.status).toBe(401);
  });

  it('prevents cookie-only role escalation when JWT token has lower privilege', async () => {
    const customerToken = await signJwt({
      sub: 'cust_123',
      email: 'clara.oswald@medipulse.io',
      role: 'customer',
      effectiveRole: 'customer',
      isSuperAdmin: false,
      site_id: '65e0123456789abcdef00001',
    });

    // 1. Edge Proxy checks token payload, sees non-superadmin claims, and redirects away
    const proxyReq = new NextRequest('http://localhost:3000/super-dashboard');
    proxyReq.cookies.set('token', customerToken);
    proxyReq.cookies.set('role', 'super_admin');
    const proxyRes = proxy(proxyReq);
    expect(proxyRes.status).toBe(307);
    expect(proxyRes.headers.get('location')).toBe('http://localhost:3000/dashboard');

    // 2. Backend API checks real cryptographically signed token claims, ignoring cookie spoofing
    const apiReq = new Request('http://localhost:3000/api/users', {
      headers: {
        Cookie: `token=${customerToken}; role=super_admin`,
      },
    });
    const auth = await verifyApiAuth(apiReq, { requireSuperAdmin: true });
    expect(auth.authorized).toBe(false);
    expect(auth.errorResponse?.status).toBe(403);
  });
});
