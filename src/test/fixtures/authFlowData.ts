export interface RoleTestCase {
  roleName: string;
  email: string;
  expectedRole: string;
  expectedRedirect: string;
  expectedHeaderTitle: string;
}

export const ROLES_TO_TEST: RoleTestCase[] = [
  {
    roleName: 'Super Admin',
    email: 'kumarharshit370@gmail.com',
    expectedRole: 'super_admin',
    expectedRedirect: '/super-dashboard',
    expectedHeaderTitle: 'Super Admin Dashboard',
  },
  {
    roleName: 'Admin',
    email: 'admin.vance@medipulse.io',
    expectedRole: 'admin',
    expectedRedirect: '/dashboard',
    expectedHeaderTitle: 'Admin Operations Dashboard',
  },
  {
    roleName: 'Prescriber',
    email: 'dr.watson@medipulse.io',
    expectedRole: 'prescriber',
    expectedRedirect: '/dashboard',
    expectedHeaderTitle: 'Clinical & Prescriptions Dashboard',
  },
  {
    roleName: 'Pharmacist',
    email: 'marcus.sterling@medipulse.io',
    expectedRole: 'pharmacist',
    expectedRedirect: '/dashboard',
    expectedHeaderTitle: 'Pharmacy Dispensing Dashboard',
  },
  {
    roleName: 'Pharmacy Staff',
    email: 'chloe.bennett@medipulse.io',
    expectedRole: 'pharmacy_staff',
    expectedRedirect: '/dashboard',
    expectedHeaderTitle: 'Pharmacy Operations Dashboard',
  },
  {
    roleName: 'Customer Support',
    email: 'liam.reynolds@medipulse.io',
    expectedRole: 'customer_support',
    expectedRedirect: '/dashboard',
    expectedHeaderTitle: 'Customer Support Dashboard',
  },
  {
    roleName: 'Driver',
    email: 'david.miller@medipulse.io',
    expectedRole: 'driver',
    expectedRedirect: '/dashboard',
    expectedHeaderTitle: 'Logistics & Deliveries Dashboard',
  },
  {
    roleName: 'Customer',
    email: 'clara.oswald@medipulse.io',
    expectedRole: 'customer',
    expectedRedirect: '/dashboard',
    expectedHeaderTitle: 'Customer Account Dashboard',
  },
];
