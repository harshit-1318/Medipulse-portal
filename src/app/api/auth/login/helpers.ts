import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { signJwt } from '@/lib/auth/jwt';
import { getRolePermissions } from './permissions';

export { getRolePermissions };

export async function verifyUserPassword(
  dbUser: any,
  passwordStr: string
): Promise<boolean> {
  const storedPassword = dbUser.password || '';
  if (!storedPassword) return false;

  if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
    return bcrypt.compareSync(passwordStr, storedPassword);
  }
  return storedPassword === passwordStr;
}

export function checkIsSuperAdmin(dbUser: any, emailStr: string): boolean {
  if (dbUser.is_super_admin || dbUser.role === 'super_admin' || dbUser.role === 'superadmin') {
    return true;
  }
  const envEmails = (process.env.SUPER_ADMIN_EMAILS || '')
    .toLowerCase()
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  return envEmails.includes(emailStr);
}

export async function buildAuthPayload(dbUser: any, emailStr: string, isSuperAdmin: boolean) {
  const role = isSuperAdmin ? 'super_admin' : (dbUser.role || 'prescriber');
  const name = dbUser.name || (emailStr ? emailStr.split('@')[0] : 'User');
  const siteId = dbUser.site_id || '65e0123456789abcdef00001';

  const userPayload = {
    _id: dbUser._id.toString(),
    id: dbUser._id.toString(),
    email: dbUser.email,
    name,
    role,
    is_super_admin: isSuperAdmin,
    effectiveRole: isSuperAdmin ? 'super_admin' : role,
    site_id: siteId,
    permissions: isSuperAdmin ? ['*'] : getRolePermissions(role),
  };

  const token = await signJwt({
    sub: dbUser._id.toString(),
    email: dbUser.email,
    role,
    effectiveRole: userPayload.effectiveRole,
    isSuperAdmin,
    site_id: siteId,
  });

  return { userPayload, token, isSuperAdmin, role, name };
}

export function setAuthCookies(
  response: NextResponse,
  token: string,
  effectiveRole: string,
  name: string,
  siteId?: string
) {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = 60 * 60 * 24 * 7;

  // Secure httpOnly cookie for server-side auth proxy & API routes
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  // Non-httpOnly cookies for client hydration
  const clientOpts = { httpOnly: false, secure: isProd, sameSite: 'lax' as const, path: '/', maxAge };
  response.cookies.set('role', effectiveRole, clientOpts);
  response.cookies.set('username', name.toLowerCase(), clientOpts);
  if (siteId) {
    response.cookies.set('site_id', siteId, clientOpts);
  }
}
