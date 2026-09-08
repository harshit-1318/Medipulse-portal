import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy, config } from './proxy';

function req(url: string, cookies: Record<string, string> = {}): NextRequest {
  const r = new NextRequest(url);
  Object.entries(cookies).forEach(([k, v]) => r.cookies.set(k, v));
  return r;
}

describe('proxy (Next.js 16 Proxy Convention)', () => {
  it.each([
    ['/', {}, 307, 'http://localhost:3000/login'],
    ['/', { token: 't', role: 'super_admin' }, 307, 'http://localhost:3000/super-dashboard'],
    ['/', { token: 't', role: 'admin' }, 307, 'http://localhost:3000/dashboard'],
    ['/search?q=test', {}, 307, 'http://localhost:3000/orders/search?q=test'],
    ['/orders', { token: 't', role: 'admin' }, 307, 'http://localhost:3000/orders/all'],
    ['/login', { token: 't', role: 'superadmin' }, 307, 'http://localhost:3000/super-dashboard'],
    ['/login', { token: 't', role: 'user' }, 307, 'http://localhost:3000/dashboard'],
    ['/dashboard', { token: 't', role: 'super_admin' }, 307, 'http://localhost:3000/super-dashboard'],
    ['/super-dashboard', { token: 't', role: 'user' }, 307, 'http://localhost:3000/dashboard'],
    ['/sites', { token: 't', role: 'prescriber' }, 307, 'http://localhost:3000/dashboard'],
    ['/users', { token: 't', role: 'prescriber' }, 307, 'http://localhost:3000/dashboard'],
    ['/login', {}, 200, null],
    ['/api/health', {}, 200, null],
    ['/prescriptions', { token: 't', role: 'prescriber' }, 200, null],
    ['/orders/all', { token: 't', role: 'prescriber' }, 200, null],
    ['/prescriptions', { token: 't', role: 'driver' }, 307, 'http://localhost:3000/dashboard'],
    ['/docman-jobs', { token: 't', role: 'customer_support' }, 307, 'http://localhost:3000/dashboard'],
    ['/leads', { token: 't', role: 'customer_support' }, 200, null],
    ['/customers', { token: 't', role: 'customer_support' }, 200, null],
    ['/docman-jobs', { token: 't', role: 'admin' }, 200, null],
    ['/sites', { token: 't', role: 'admin' }, 307, 'http://localhost:3000/dashboard'],
    ['/users', { token: 't', role: 'admin' }, 307, 'http://localhost:3000/dashboard'],
  ])('route %s with %o redirects to %s', (path, cookies, status, redirect) => {
    const res = proxy(req(`http://localhost:3000${path}`, cookies));
    expect(res.status).toBe(status);
    if (redirect) expect(res.headers.get('location')).toBe(redirect);
  });

  it('redirects unauthenticated user on protected route to /login with returnUrl', () => {
    const res = proxy(req('http://localhost:3000/orders?status=active'));
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get('location')!);
    expect(location.pathname).toBe('/login');
    expect(location.searchParams.get('returnUrl')).toBe('/orders?status=active');
  });

  it('exports valid matcher config', () => {
    expect(Array.isArray(config.matcher)).toBe(true);
  });
});
