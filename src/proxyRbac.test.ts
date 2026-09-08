import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

function mockReq(url: string, cookies: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(url);
  Object.entries(cookies).forEach(([k, v]) => req.cookies.set(k, v));
  return req;
}

describe('proxy - protected routes & RBAC enforcement', () => {
  it('redirects unauthenticated user from protected route to /login with returnUrl', () => {
    const res = proxy(mockReq('http://localhost:3000/orders?status=active'));
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get('location')!);
    expect(location.pathname).toBe('/login');
    expect(location.searchParams.get('returnUrl')).toBe('/orders?status=active');
  });

  it('allows authenticated prescriber to access prescriptions and orders', () => {
    const reqPrescriptions = mockReq('http://localhost:3000/prescriptions', { token: 'tok', role: 'prescriber' });
    expect(proxy(reqPrescriptions).status).toBe(200);

    const reqOrders = mockReq('http://localhost:3000/orders/all', { token: 'tok', role: 'prescriber' });
    expect(proxy(reqOrders).status).toBe(200);
  });

  it('blocks driver from accessing prescriptions and redirects to dashboard', () => {
    const res = proxy(mockReq('http://localhost:3000/prescriptions', { token: 'tok', role: 'driver' }));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });

  it('blocks customer support from accessing docman jobs', () => {
    const res = proxy(mockReq('http://localhost:3000/docman-jobs', { token: 'tok', role: 'customer_support' }));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });

  it('allows customer support to access leads and customers', () => {
    expect(proxy(mockReq('http://localhost:3000/leads', { token: 'tok', role: 'customer_support' })).status).toBe(200);
    expect(proxy(mockReq('http://localhost:3000/customers', { token: 'tok', role: 'customer_support' })).status).toBe(200);
  });

  it('allows admin to access docman jobs and surveys but blocks sites', () => {
    expect(proxy(mockReq('http://localhost:3000/docman-jobs', { token: 'tok', role: 'admin' })).status).toBe(200);

    const resSites = proxy(mockReq('http://localhost:3000/sites', { token: 'tok', role: 'admin' }));
    expect(resSites.status).toBe(307);
    expect(resSites.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });

  it('blocks admin from accessing superAdminOnlyRoutes like /users', () => {
    const resUsers = proxy(mockReq('http://localhost:3000/users', { token: 'tok', role: 'admin' }));
    expect(resUsers.status).toBe(307);
    expect(resUsers.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });
});
