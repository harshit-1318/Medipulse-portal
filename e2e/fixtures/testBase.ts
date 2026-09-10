import { test as base, expect } from '@playwright/test';
import { OrdersPage } from '../pages/OrdersPage';
import { reportCollector } from '../utils/reportCollector';

type CustomFixtures = {
  ordersPage: OrdersPage;
};

let cachedAuth: { cookies: any[]; token: string; user: any } | null = null;

async function getAuthCredentials(request: any) {
  if (cachedAuth) return cachedAuth;

  const res = await request.post('http://localhost:3000/api/auth/login', {
    data: { email: 'admin.vance@medipulse.io', password: 'Password123!' },
  });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  const headers = res.headers();
  const setCookie = headers['set-cookie'] || '';

  // Extract cookies
  const cookies: any[] = [];
  const parts = setCookie.split(/,\s*(?=[a-zA-Z0-9_-]+=)/);
  for (const part of parts) {
    const [cookiePair] = part.split(';');
    const eq = cookiePair.indexOf('=');
    if (eq > 0) {
      cookies.push({
        name: cookiePair.slice(0, eq).trim(),
        value: cookiePair.slice(eq + 1).trim(),
        domain: 'localhost',
        path: '/',
      });
    }
  }

  cachedAuth = {
    cookies,
    token: json.data.token,
    user: json.data.user,
  };
  return cachedAuth;
}

export const test = base.extend<CustomFixtures>({
  ordersPage: async ({ page, context, request }, use, testInfo) => {
    const auth = await getAuthCredentials(request);

    // Add authentication cookies to browser context
    await context.addCookies(auth.cookies);

    // Add init script to configure localStorage before React mounts
    await page.addInitScript((data) => {
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('accessToken', data.token);
      window.localStorage.setItem('jwt', data.token);
      window.localStorage.setItem('X-SITE-ID', '65e0123456789abcdef00001');
      window.localStorage.setItem('X-SITE-KEY', 'default');
      window.localStorage.setItem('X-SITE-HOST', 'localhost:3000');
      window.localStorage.setItem('user', JSON.stringify(data.user));
    }, { token: auth.token, user: auth.user });

    const ordersPage = new OrdersPage(page);
    await ordersPage.setupApiInterceptor();
    await ordersPage.goto();

    // Reset filters before each test
    await ordersPage.resetAllFilters();

    // Run the actual test
    await use(ordersPage);

    // Clean up / reset filters after test
    try {
      if (!page.isClosed()) {
        await ordersPage.resetAllFilters();
      }
    } catch {
      // Ignore if page closed
    }
  },
});

export { expect };
