// Protected routes requiring valid auth token
export const protectedRoutes = [
  '/dashboard', '/super-dashboard', '/sites', '/orders', '/customers',
  '/leads', '/prescriptions', '/users', '/surveys', '/activity-logs',
  '/queue-monitor', '/docman-jobs', '/account',
];

// Routes strictly restricted to super admin accounts
export const superAdminOnlyRoutes = ['/super-dashboard', '/sites', '/users'];

// Role-based route access mapping
export const roleAllowedRoutes: Record<string, string[]> = {
  super_admin: ['*'],
  admin: [
    '/dashboard', '/orders', '/customers', '/leads', '/prescriptions',
    '/surveys', '/activity-logs', '/queue-monitor', '/docman-jobs', '/account',
  ],
  prescriber: ['/dashboard', '/orders', '/customers', '/prescriptions', '/account'],
  pharmacist: ['/dashboard', '/orders', '/customers', '/prescriptions', '/account'],
  pharmacy_staff: ['/dashboard', '/orders', '/prescriptions', '/account'],
  customer_support: ['/dashboard', '/orders', '/customers', '/leads', '/account'],
  driver: ['/dashboard', '/orders', '/account'],
  user: ['/dashboard', '/account'],
  customer: ['/dashboard', '/account'],
};

export function isRouteAllowedForRole(pathname: string, role: string): boolean {
  const normalizedRole = (role || 'user').toLowerCase();
  if (normalizedRole === 'super_admin' || normalizedRole === 'superadmin') {
    return true;
  }
  const allowed = roleAllowedRoutes[normalizedRole] || roleAllowedRoutes.user;
  return allowed.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export const isPublicRoute = (path: string) =>
  path === '/login' ||
  path === '/register' ||
  path === '/favicon.ico' ||
  path === '/s' ||
  path.startsWith('/login/') ||
  path.startsWith('/register/') ||
  path.startsWith('/api/') ||
  path.startsWith('/s/') ||
  path.startsWith('/_next/');
