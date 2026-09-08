import { POST as loginRoute } from '@/app/api/auth/login/route';
import { POST as logoutRoute } from '@/app/api/auth/logout/route';
import { proxy } from '@/proxy';
import { NextRequest } from 'next/server';
import { verifyJwt, verifyApiAuth } from '@/lib/auth';
import { isRouteAllowedForRole } from '@/proxyRoutes';

export const ALL_PORTAL_ROUTES = [
  '/super-dashboard', '/dashboard', '/sites', '/users', '/orders',
  '/prescriptions', '/customers', '/leads', '/surveys', '/activity-logs',
  '/queue-monitor', '/docman-jobs', '/account',
];

export async function verifyAuditLogin(email: string) {
  const makeReq = () => new Request('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password123!' }),
  });
  let res = await loginRoute(makeReq());
  if (res.status !== 200) {
    await new Promise((r) => setTimeout(r, 500));
    res = await loginRoute(makeReq());
  }
  if (res.status !== 200) throw new Error(`Login failed for ${email}`);
  const data = await res.json();
  const token = data.data?.token;
  const decoded = await verifyJwt(token);
  if (!decoded || decoded.email.toLowerCase() !== email.toLowerCase()) {
    throw new Error(`JWT claims verification failed for ${email}`);
  }
  return token;
}

export function verifyAuditDashboard(token: string, role: string, expectedLanding: string) {
  const rootReq = new NextRequest('http://localhost:3000/');
  rootReq.cookies.set('token', token);
  rootReq.cookies.set('role', role);
  const actualLanding = proxy(rootReq).headers.get('location')?.replace('http://localhost:3000', '');
  if (actualLanding !== expectedLanding) throw new Error(`Landing mismatch: ${actualLanding}`);

  const testPath = role === 'super_admin' ? '/dashboard' : '/super-dashboard';
  const expectedBounce = role === 'super_admin' ? '/super-dashboard' : '/dashboard';
  const req = new NextRequest(`http://localhost:3000${testPath}`);
  req.cookies.set('token', token);
  req.cookies.set('role', role);
  if (proxy(req).headers.get('location') !== `http://localhost:3000${expectedBounce}`) {
    throw new Error(`Separation failed for ${role}`);
  }
}

export async function verifyAuditPermissions(token: string, role: string) {
  const isSuper = role === 'super_admin';
  let authPassed = 0;
  let unauthBlocked = 0;

  for (const route of ALL_PORTAL_ROUTES) {
    const isAllowed = isSuper || isRouteAllowedForRole(route, role);
    const req = new NextRequest(`http://localhost:3000${route}`);
    req.cookies.set('token', token);
    req.cookies.set('role', role);
    const res = proxy(req);

    if (isAllowed) {
      const isSuperDashRedirect = isSuper && route === '/dashboard' && res.headers.get('location')?.includes('/super-dashboard');
      const isOrdersRedirect = route === '/orders' && res.headers.get('location')?.includes('/orders/all');
      if (res.status === 200 || isOrdersRedirect || isSuperDashRedirect) {
        authPassed++;
      } else {
        throw new Error(`Route guard failure: ${route} for ${role}`);
      }
    } else if (!isAllowed && res.status === 307 && res.headers.get('location') === 'http://localhost:3000/dashboard') {
      unauthBlocked++;
    } else {
      throw new Error(`Route guard failure: ${route} for ${role}`);
    }
  }

  const apiReq = new Request('http://localhost:3000/api/users', { headers: { Authorization: `Bearer ${token}` } });
  const superAuth = await verifyApiAuth(apiReq, { requireSuperAdmin: true });
  if ((isSuper && !superAuth.authorized) || (!isSuper && superAuth.authorized)) {
    throw new Error(`Super admin API auth failed for ${role}`);
  }

  return { authPassed, unauthBlocked };
}

export async function verifyAuditLogout(expectedLanding: string) {
  const logoutRes = await logoutRoute();
  const logoutCookie = logoutRes.headers.get('set-cookie') || '';
  if (!logoutCookie.includes('token=;') || !logoutCookie.includes('Max-Age=0')) {
    throw new Error('Logout failed to clear cookies');
  }
  const unauthReq = new NextRequest(`http://localhost:3000${expectedLanding}`);
  if (!proxy(unauthReq).headers.get('location')?.includes('/login')) {
    throw new Error('Unauthenticated access was not redirected to /login');
  }
}
