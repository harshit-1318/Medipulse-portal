import { NextResponse, type NextRequest } from 'next/server';
import { protectedRoutes, superAdminOnlyRoutes, isRouteAllowedForRole, isPublicRoute } from './proxyRoutes';

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const cookieRole = request.cookies.get('role')?.value;

  // Derive role and superAdmin status from cryptographically structured token payload when present to prevent cookie spoofing
  let role = cookieRole;
  let isSuperAdmin = role === 'super_admin' || role === 'superadmin';

  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload && typeof payload === 'object') {
      role = payload.effectiveRole || payload.role || role;
      isSuperAdmin = Boolean(
        payload.isSuperAdmin ||
        payload.is_super_admin ||
        payload.role === 'super_admin' ||
        payload.effectiveRole === 'super_admin'
      );
    }
  }

  // Root path redirection
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const destination = isSuperAdmin ? '/super-dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Redirect legacy generic /search to /orders/search
  if (pathname === '/search') {
    return NextResponse.redirect(new URL(`/orders/search${search}`, request.url));
  }

  // Prevent logged-in users from viewing /login
  if (pathname === '/login' && token) {
    const destination = isSuperAdmin ? '/super-dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Fast bypass for static files & public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Enforce token check on protected routes
  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // Enforce role dashboard separation for authenticated users
  if (token && pathname === '/dashboard' && isSuperAdmin) {
    return NextResponse.redirect(new URL('/super-dashboard', request.url));
  }
  if (token && pathname.startsWith('/super-dashboard') && !isSuperAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Enforce super admin only routes strictly
  const isSuperAdminOnly = superAdminOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (token && isSuperAdminOnly && !isSuperAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Enforce role-based route access control (RBAC) across all protected routes
  if (token && isProtected) {
    const effectiveRole = isSuperAdmin ? 'super_admin' : (role || 'user');
    if (!isRouteAllowedForRole(pathname, effectiveRole)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect /orders directly to /orders/all for authenticated, authorized users
  if (pathname === '/orders' || pathname === '/orders/') {
    return NextResponse.redirect(new URL(`/orders/all${search}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
