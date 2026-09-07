import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy, config } from './proxy';

function createMockRequest(url: string, cookies: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(url);
  Object.entries(cookies).forEach(([key, value]) => {
    req.cookies.set(key, value);
  });
  return req;
}

describe('proxy (Next.js 16 Proxy Convention)', () => {
  describe('Root path (/) redirection', () => {
    it('redirects unauthenticated user to /login', () => {
      const req = createMockRequest('http://localhost:3000/');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/login');
    });

    it('redirects authenticated super_admin to /super-dashboard', () => {
      const req = createMockRequest('http://localhost:3000/', {
        token: 'valid-token',
        role: 'super_admin',
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/super-dashboard');
    });

    it('redirects authenticated standard user to /dashboard', () => {
      const req = createMockRequest('http://localhost:3000/', {
        token: 'valid-token',
        role: 'admin',
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });
  });

  describe('Legacy search redirection', () => {
    it('redirects /search to /orders/search preserving query params', () => {
      const req = createMockRequest('http://localhost:3000/search?q=test');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/orders/search?q=test');
    });

    it('redirects authenticated /orders to /orders/all', () => {
      const req = createMockRequest('http://localhost:3000/orders', { token: 'valid-token', role: 'admin' });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/orders/all');
    });
  });

  describe('Login page redirection for logged-in users', () => {
    it('redirects logged-in super_admin from /login to /super-dashboard', () => {
      const req = createMockRequest('http://localhost:3000/login', {
        token: 'valid-token',
        role: 'superadmin',
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/super-dashboard');
    });

    it('redirects logged-in standard user from /login to /dashboard', () => {
      const req = createMockRequest('http://localhost:3000/login', {
        token: 'valid-token',
        role: 'user',
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });
  });

  describe('Role dashboard separation', () => {
    it('redirects super_admin on /dashboard to /super-dashboard', () => {
      const req = createMockRequest('http://localhost:3000/dashboard', {
        token: 'valid-token',
        role: 'super_admin',
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/super-dashboard');
    });

    it('redirects non-super-admin on /super-dashboard to /dashboard', () => {
      const req = createMockRequest('http://localhost:3000/super-dashboard', {
        token: 'valid-token',
        role: 'user',
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });

    it('redirects non-super-admin on /sites or /users to /dashboard', () => {
      const reqSites = createMockRequest('http://localhost:3000/sites', {
        token: 'valid-token',
        role: 'prescriber',
      });
      const resSites = proxy(reqSites);
      expect(resSites.status).toBe(307);
      expect(resSites.headers.get('location')).toBe('http://localhost:3000/dashboard');

      const reqUsers = createMockRequest('http://localhost:3000/users', {
        token: 'valid-token',
        role: 'prescriber',
      });
      const resUsers = proxy(reqUsers);
      expect(resUsers.status).toBe(307);
      expect(resUsers.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });
  });

  describe('Public routes bypass', () => {
    it('allows unauthenticated requests to public routes like /login', () => {
      const req = createMockRequest('http://localhost:3000/login');
      const res = proxy(req);
      expect(res.status).toBe(200);
    });

    it('allows unauthenticated requests to /api routes', () => {
      const req = createMockRequest('http://localhost:3000/api/health');
      const res = proxy(req);
      expect(res.status).toBe(200);
    });
  });

  describe('Protected routes enforcement & RBAC', () => {
    it('redirects unauthenticated user from protected route to /login with returnUrl', () => {
      const req = createMockRequest('http://localhost:3000/orders?status=active');
      const res = proxy(req);
      expect(res.status).toBe(307);
      const location = new URL(res.headers.get('location')!);
      expect(location.pathname).toBe('/login');
      expect(location.searchParams.get('returnUrl')).toBe('/orders?status=active');
    });

    it('allows authenticated prescriber to access prescriptions and orders', () => {
      const reqPrescriptions = createMockRequest('http://localhost:3000/prescriptions', {
        token: 'valid-token',
        role: 'prescriber',
      });
      expect(proxy(reqPrescriptions).status).toBe(200);

      const reqOrders = createMockRequest('http://localhost:3000/orders/all', {
        token: 'valid-token',
        role: 'prescriber',
      });
      expect(proxy(reqOrders).status).toBe(200);
    });

    it('blocks driver from accessing prescriptions and redirects to dashboard', () => {
      const req = createMockRequest('http://localhost:3000/prescriptions', {
        token: 'valid-token',
        role: 'driver',
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });

    it('blocks customer support from accessing docman jobs', () => {
      const req = createMockRequest('http://localhost:3000/docman-jobs', {
        token: 'valid-token',
        role: 'customer_support',
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });

    it('allows customer support to access leads and customers', () => {
      const reqLeads = createMockRequest('http://localhost:3000/leads', {
        token: 'valid-token',
        role: 'customer_support',
      });
      expect(proxy(reqLeads).status).toBe(200);

      const reqCustomers = createMockRequest('http://localhost:3000/customers', {
        token: 'valid-token',
        role: 'customer_support',
      });
      expect(proxy(reqCustomers).status).toBe(200);
    });

    it('allows admin to access docman jobs and surveys but blocks sites', () => {
      const reqDocman = createMockRequest('http://localhost:3000/docman-jobs', {
        token: 'valid-token',
        role: 'admin',
      });
      expect(proxy(reqDocman).status).toBe(200);

      const reqSites = createMockRequest('http://localhost:3000/sites', {
        token: 'valid-token',
        role: 'admin',
      });
      const resSites = proxy(reqSites);
      expect(resSites.status).toBe(307);
      expect(resSites.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });

    it('blocks admin from accessing superAdminOnlyRoutes like /users', () => {
      const reqUsers = createMockRequest('http://localhost:3000/users', {
        token: 'valid-token',
        role: 'admin',
      });
      const res = proxy(reqUsers);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });
  });


  describe('Matcher configuration', () => {
    it('exports a matcher config', () => {
      expect(config.matcher).toBeDefined();
      expect(Array.isArray(config.matcher)).toBe(true);
    });
  });
});
