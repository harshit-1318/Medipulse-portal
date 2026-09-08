import { describe, it, expect } from 'vitest';
import { decodeJwtPayload } from './proxyJwt';

describe('decodeJwtPayload', () => {
  it('decodes a valid base64url encoded JWT payload', () => {
    // payload: { role: 'admin', isSuperAdmin: false }
    const sampleToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4iLCJpc1N1cGVyQWRtaW4iOmZhbHNlfQ.signature';
    const payload = decodeJwtPayload(sampleToken);
    expect(payload).toEqual({ role: 'admin', isSuperAdmin: false });
  });

  it('handles tokens with url-safe base64 characters (- and _)', () => {
    // payload with base64 requiring url-safe replacement
    const payloadObj = { email: 'user@example.com', role: 'super_admin' };
    const base64 = btoa(JSON.stringify(payloadObj)).replace(/\+/g, '-').replace(/\//g, '_');
    const token = `header.${base64}.sig`;
    const payload = decodeJwtPayload(token);
    expect(payload.role).toBe('super_admin');
  });

  it('returns null for invalid token structure', () => {
    expect(decodeJwtPayload('invalid-token')).toBeNull();
    expect(decodeJwtPayload('header.only')).toBeNull();
    expect(decodeJwtPayload('')).toBeNull();
  });

  it('returns null for corrupt base64 payload', () => {
    expect(decodeJwtPayload('header.!!!invalid-base64!!!.sig')).toBeNull();
  });
});
