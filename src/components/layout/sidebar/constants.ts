import {
    LayoutDashboard,
    ClipboardList,
    Users,
} from 'lucide-react';
import { ordersFiltersMenu } from './menus/ordersFilters';
import { adminNavSection } from './adminNavConfig';
import type { NavItem } from './types';

export type { NavItem };

const NON_SUPER_ADMIN_ROLES = [
    'admin',
    'pharmacist',
    'prescriber',
    'pharmacy_staff',
    'customer_support',
    'driver',
    'user',
    'customer',
];

export const navItems: { section?: string; items: NavItem[] }[] = [
    {
        section: 'Dashboard',
        items: [
            {
                title: 'Overview',
                path: '/dashboard',
                icon: LayoutDashboard,
                role: NON_SUPER_ADMIN_ROLES,
            },
            {
                title: 'Super Admin Overview',
                path: '/super-dashboard',
                icon: LayoutDashboard,
                role: ['super_admin'],
            },
        ]
    },
    {
        section: 'Pages',
        items: [
            {
                ...ordersFiltersMenu,
                role: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'pharmacy_staff', 'customer_support', 'driver'],
            },
            {
                title: 'Prescriptions',
                path: '/prescriptions',
                icon: ClipboardList,
                role: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'pharmacy_staff'],
            },
            {
                title: 'Customers',
                path: '/customers',
                icon: Users,
                role: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'customer_support'],
            },
        ]
    },
    adminNavSection
];
