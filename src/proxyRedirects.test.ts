import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy, config } from './proxy';

function mockReq(url: string, cookies: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(url);
  Object.entries(cookies).forEach(([k, v]) => req.cookies.set(k, v));
  return req;
}

describe('proxy - redirects & public routes', () => {
  describe('Root path (/) redirection', () => {
    it('redirects unauthenticated user to /login', () => {
      const res = proxy(mockReq('http://localhost:3000/'));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/login');
    });

    it('redirects authenticated super_admin to /super-dashboard', () => {
      const res = proxy(mockReq('http://localhost:3000/', { token: 'tok', role: 'super_admin' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/super-dashboard');
    });

    it('redirects authenticated standard user to /dashboard', () => {
      const res = proxy(mockReq('http://localhost:3000/', { token: 'tok', role: 'admin' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });
  });

  describe('Legacy search and orders redirection', () => {
    it('redirects /search to /orders/search preserving query params', () => {
      const res = proxy(mockReq('http://localhost:3000/search?q=test'));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/orders/search?q=test');
    });

    it('redirects authenticated /orders to /orders/all', () => {
      const res = proxy(mockReq('http://localhost:3000/orders', { token: 'tok', role: 'admin' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/orders/all');
    });
  });

  describe('Login page redirection for logged-in users', () => {
    it('redirects logged-in super_admin from /login to /super-dashboard', () => {
      const res = proxy(mockReq('http://localhost:3000/login', { token: 'tok', role: 'superadmin' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/super-dashboard');
    });

    it('redirects logged-in standard user from /login to /dashboard', () => {
      const res = proxy(mockReq('http://localhost:3000/login', { token: 'tok', role: 'user' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });
  });

  describe('Role dashboard separation', () => {
    it('redirects super_admin on /dashboard to /super-dashboard', () => {
      const res = proxy(mockReq('http://localhost:3000/dashboard', { token: 'tok', role: 'super_admin' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/super-dashboard');
    });

    it('redirects non-super-admin on /super-dashboard to /dashboard', () => {
      const res = proxy(mockReq('http://localhost:3000/super-dashboard', { token: 'tok', role: 'user' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });

    it('redirects non-super-admin on /sites or /users to /dashboard', () => {
      const resSites = proxy(mockReq('http://localhost:3000/sites', { token: 'tok', role: 'prescriber' }));
      expect(resSites.status).toBe(307);
      expect(resSites.headers.get('location')).toBe('http://localhost:3000/dashboard');

      const resUsers = proxy(mockReq('http://localhost:3000/users', { token: 'tok', role: 'prescriber' }));
      expect(resUsers.status).toBe(307);
      expect(resUsers.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });
  });

  describe('Public routes bypass & config', () => {
    it('allows unauthenticated requests to public routes and /api', () => {
      expect(proxy(mockReq('http://localhost:3000/login')).status).toBe(200);
      expect(proxy(mockReq('http://localhost:3000/api/health')).status).toBe(200);
    });

    it('exports a valid matcher config', () => {
      expect(Array.isArray(config.matcher)).toBe(true);
    });
  });
});
