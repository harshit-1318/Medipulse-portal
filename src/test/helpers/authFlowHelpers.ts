import { expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';
import { verifyApiAuth } from '@/lib/auth';

export function assertDashboardRouting(authToken: string, role: string, expectedRedirect: string) {
  const rootReq = new NextRequest('http://localhost:3000/');
  rootReq.cookies.set('token', authToken);
  rootReq.cookies.set('role', role);
  const rootRes = proxy(rootReq);

  expect(rootRes.status).toBe(307);
  expect(rootRes.headers.get('location')).toBe(`http://localhost:3000${expectedRedirect}`);

  if (role === 'super_admin') {
    const dbReq = new NextRequest('http://localhost:3000/dashboard');
    dbReq.cookies.set('token', authToken);
    dbReq.cookies.set('role', 'super_admin');
    expect(proxy(dbReq).headers.get('location')).toBe('http://localhost:3000/super-dashboard');
  } else {
    const superReq = new NextRequest('http://localhost:3000/super-dashboard');
    superReq.cookies.set('token', authToken);
    superReq.cookies.set('role', role);
    expect(proxy(superReq).headers.get('location')).toBe('http://localhost:3000/dashboard');
  }
}

export async function assertRouteAndApiPermissions(authToken: string, role: string, redirect: string) {
  const isSuper = role === 'super_admin';

  // Landing page access check
  const landingReq = new NextRequest(`http://localhost:3000${redirect}`);
  landingReq.cookies.set('token', authToken);
  landingReq.cookies.set('role', role);
  expect(proxy(landingReq).status).toBe(200);

  // Administrative /users route check
  const usersReq = new NextRequest('http://localhost:3000/users');
  usersReq.cookies.set('token', authToken);
  usersReq.cookies.set('role', role);
  const usersRes = proxy(usersReq);
  if (isSuper) {
    expect(usersRes.status).toBe(200);
  } else {
    expect(usersRes.status).toBe(307);
    expect(usersRes.headers.get('location')).toBe('http://localhost:3000/dashboard');
  }

  // Backend API verification
  const apiReqSuper = new Request('http://localhost:3000/api/users', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  const superCheck = await verifyApiAuth(apiReqSuper, { requireSuperAdmin: true });
  expect(superCheck.authorized).toBe(isSuper);
}
