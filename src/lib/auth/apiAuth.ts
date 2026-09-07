import { NextResponse } from 'next/server';
import { verifyJwt, type JwtPayload } from './jwt';

export interface AuthCheckOptions {
  requiredRoles?: string[];
  requireSuperAdmin?: boolean;
}

export interface AuthResult {
  authorized: boolean;
  user: JwtPayload | null;
  errorResponse: NextResponse | null;
}

function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.substring(7).trim();
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  if (match) {
    return decodeURIComponent(match[1]);
  }

  return null;
}

export async function verifyApiAuth(
  request: Request,
  options: AuthCheckOptions = {}
): Promise<AuthResult> {
  const token = extractToken(request);
  if (!token) {
    return {
      authorized: false,
      user: null,
      errorResponse: NextResponse.json(
        { status: 'ERROR', success: false, message: 'Unauthorized: Missing authentication token', data: null },
        { status: 401 }
      ),
    };
  }

  const user = await verifyJwt<JwtPayload>(token);
  if (!user) {
    return {
      authorized: false,
      user: null,
      errorResponse: NextResponse.json(
        { status: 'ERROR', success: false, message: 'Unauthorized: Invalid or expired token', data: null },
        { status: 401 }
      ),
    };
  }

  const isSuper = Boolean(user.isSuperAdmin || user.role === 'super_admin' || user.effectiveRole === 'super_admin');

  if (options.requireSuperAdmin && !isSuper) {
    return {
      authorized: false,
      user,
      errorResponse: NextResponse.json(
        { status: 'ERROR', success: false, message: 'Forbidden: Super Admin access required', data: null },
        { status: 403 }
      ),
    };
  }

  if (options.requiredRoles && options.requiredRoles.length > 0 && !isSuper) {
    const userRole = (user.effectiveRole || user.role || '').toLowerCase();
    const hasRole = options.requiredRoles.map((r) => r.toLowerCase()).includes(userRole);
    if (!hasRole) {
      return {
        authorized: false,
        user,
        errorResponse: NextResponse.json(
          { status: 'ERROR', success: false, message: 'Forbidden: Insufficient permissions for this resource', data: null },
          { status: 403 }
        ),
      };
    }
  }

  return { authorized: true, user, errorResponse: null };
}
