import { test as base, expect } from '@playwright/test';
import { ActivityLogsPage } from '../pages/ActivityLogsPage';

type ActivityFixtures = {
  activityLogsPage: ActivityLogsPage;
};

let cachedSuperAdminAuth: { cookies: any[]; token: string; user: any } | null = null;

async function getSuperAdminAuth(request: any) {
  if (cachedSuperAdminAuth) return cachedSuperAdminAuth;

  const res = await request.post('http://localhost:3000/api/auth/login', {
    data: { email: 'kumarharshit370@gmail.com', password: 'Password123!' },
  });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  const headers = res.headers();
  const setCookie = headers['set-cookie'] || '';

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

  cachedSuperAdminAuth = {
    cookies,
    token: json.data.token,
    user: json.data.user,
  };
  return cachedSuperAdminAuth;
}

export const test = base.extend<ActivityFixtures>({
  activityLogsPage: async ({ page, context, request }, use) => {
    const auth = await getSuperAdminAuth(request);

    await context.addCookies(auth.cookies);

    await page.addInitScript((data) => {
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('accessToken', data.token);
      window.localStorage.setItem('jwt', data.token);
      window.localStorage.setItem('X-SITE-ID', '65e0123456789abcdef00001');
      window.localStorage.setItem('X-SITE-KEY', 'default');
      window.localStorage.setItem('X-SITE-HOST', 'localhost:3000');
      window.localStorage.setItem('user', JSON.stringify(data.user));
    }, { token: auth.token, user: auth.user });

    const activityLogsPage = new ActivityLogsPage(page);
    await activityLogsPage.goto();

    await use(activityLogsPage);
  },
});

export { expect };
