import { NextResponse } from 'next/server';
import { recordActivity } from '@/lib/db/logActivityHelper';

function handleLogout(request?: Request) {
  let username = 'Staff';
  let role = 'user';
  let userEmail = '';

  if (request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader
        .split(';')
        .map((c) => c.trim().split('='))
        .filter(([k]) => Boolean(k))
        .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
    );
    username = cookies.username || 'Staff';
    role = cookies.role || 'user';
    userEmail =
      cookies.user_email ||
      cookies.email ||
      (role === 'super_admin' ? 'kumarharshit370@gmail.com' : `${username.toLowerCase().replace(/\s+/g, '.')}@medipulse.io`);
  }

  void recordActivity({
    action: 'logout',
    action_type: 'logout',
    user: username,
    user_name: username,
    user_email: userEmail || 'staff@medipulse.io',
    role,
    user_role: role,
    details: `${username} (${role}) logged out of the portal`,
    page: 'auth',
    view: 'auth',
  });

  const response = NextResponse.json({
    status: 'SUCCESS',
    success: true,
    message: 'Logged out successfully',
    data: null,
  });

  const clearCookieOpts = {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  };

  response.cookies.set('token', '', clearCookieOpts);
  response.cookies.set('role', '', clearCookieOpts);
  response.cookies.set('username', '', clearCookieOpts);
  response.cookies.set('site_id', '', clearCookieOpts);

  return response;
}

export async function POST(request?: Request) {
  return handleLogout(request);
}

export async function GET(request?: Request) {
  return handleLogout(request);
}
