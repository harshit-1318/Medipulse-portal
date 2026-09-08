import { describe, it, expect } from 'vitest';
import { signJwt, verifyJwt, type JwtPayload } from '../jwt';


describe('Cryptographic JWT utility (src/lib/auth/jwt.ts)', () => {
  const mockPayload: JwtPayload = {
    sub: 'user-12345',
    email: 'admin@medipulse.io',
    role: 'admin',
    effectiveRole: 'admin',
    isSuperAdmin: false,
    site_id: 'site-001',
  };

  it('signs and verifies a valid JWT payload', async () => {
    const token = await signJwt(mockPayload);
    expect(token).toBeDefined();
    expect(token.split('.')).toHaveLength(3);

    const verified = await verifyJwt<JwtPayload>(token);
    expect(verified).not.toBeNull();
    expect(verified?.sub).toBe(mockPayload.sub);
    expect(verified?.email).toBe(mockPayload.email);
    expect(verified?.role).toBe(mockPayload.role);
    expect(verified?.effectiveRole).toBe(mockPayload.effectiveRole);
    expect(verified?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('rejects tampered tokens with altered payload', async () => {
    const token = await signJwt(mockPayload);
    const [header, payload, sig] = token.split('.');

    // Tamper with payload to elevate role to super_admin
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    decoded.role = 'super_admin';
    decoded.effectiveRole = 'super_admin';
    const tamperedPayload = Buffer.from(JSON.stringify(decoded)).toString('base64url');

    const tamperedToken = `${header}.${tamperedPayload}.${sig}`;
    const verified = await verifyJwt(tamperedToken);
    expect(verified).toBeNull();
  });

  it('rejects expired tokens', async () => {
    // Expires immediately (-1 second)
    const token = await signJwt(mockPayload, -1);
    const verified = await verifyJwt(token);
    expect(verified).toBeNull();
  });

  it('returns null for malformed or empty token strings', async () => {
    expect(await verifyJwt('')).toBeNull();
    expect(await verifyJwt('invalid-string')).toBeNull();
    expect(await verifyJwt('part1.part2')).toBeNull();
  });
});
