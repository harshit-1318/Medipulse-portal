// Cross-role restricted targets defining forbidden routes and actions per role
export const ROLE_RESTRICTION_MATRIX: Record<string, {
  forbiddenRoutes: string[];
  forbiddenApis: string[];
  allowedRoutes: string[];
}> = {
  super_admin: {
    forbiddenRoutes: [],
    forbiddenApis: [],
    allowedRoutes: [
      '/super-dashboard', '/sites', '/users', '/orders', '/prescriptions',
      '/customers', '/leads', '/surveys', '/activity-logs', '/queue-monitor',
      '/docman-jobs', '/account',
    ],
  },
  admin: {
    forbiddenRoutes: ['/super-dashboard', '/sites', '/users'],
    forbiddenApis: ['/api/users (Create User)', '/api/users (List Users)'],
    allowedRoutes: [
      '/dashboard', '/orders', '/customers', '/leads', '/prescriptions',
      '/surveys', '/activity-logs', '/queue-monitor', '/docman-jobs', '/account',
    ],
  },
  prescriber: {
    forbiddenRoutes: ['/super-dashboard', '/sites', '/users', '/leads', '/surveys', '/activity-logs', '/queue-monitor', '/docman-jobs'],
    forbiddenApis: ['/api/users'],
    allowedRoutes: ['/dashboard', '/orders', '/prescriptions', '/customers', '/account'],
  },
  pharmacist: {
    forbiddenRoutes: ['/super-dashboard', '/sites', '/users', '/leads', '/surveys', '/activity-logs', '/queue-monitor', '/docman-jobs'],
    forbiddenApis: ['/api/users'],
    allowedRoutes: ['/dashboard', '/orders', '/prescriptions', '/customers', '/account'],
  },
  pharmacy_staff: {
    forbiddenRoutes: ['/super-dashboard', '/sites', '/users', '/customers', '/leads', '/surveys', '/activity-logs', '/queue-monitor', '/docman-jobs'],
    forbiddenApis: ['/api/users'],
    allowedRoutes: ['/dashboard', '/orders', '/prescriptions', '/account'],
  },
  customer_support: {
    forbiddenRoutes: ['/super-dashboard', '/sites', '/users', '/prescriptions', '/surveys', '/activity-logs', '/queue-monitor', '/docman-jobs'],
    forbiddenApis: ['/api/users'],
    allowedRoutes: ['/dashboard', '/orders', '/customers', '/leads', '/account'],
  },
  driver: {
    forbiddenRoutes: ['/super-dashboard', '/sites', '/users', '/prescriptions', '/customers', '/leads', '/surveys', '/activity-logs', '/queue-monitor', '/docman-jobs'],
    forbiddenApis: ['/api/users'],
    allowedRoutes: ['/dashboard', '/orders', '/account'],
  },
  customer: {
    forbiddenRoutes: ['/super-dashboard', '/sites', '/users', '/orders', '/prescriptions', '/customers', '/leads', '/surveys', '/activity-logs', '/queue-monitor', '/docman-jobs'],
    forbiddenApis: ['/api/users'],
    allowedRoutes: ['/dashboard', '/account'],
  },
};
