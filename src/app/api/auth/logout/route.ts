import { NextResponse } from 'next/server';

function handleLogout() {
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

export async function POST() {
  return handleLogout();
}

export async function GET() {
  return handleLogout();
}
