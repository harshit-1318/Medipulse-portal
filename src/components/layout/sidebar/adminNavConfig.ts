import {
    FileSearch,
    Mail,
    UserCheck,
} from 'lucide-react';
import type { NavItem } from '@/components/layout/sidebar/types';
import { usersMenu } from './menus/usersMenu';
import { sitesMenu } from './menus/sitesMenu';
import { surveysMenu } from './menus/surveys';
import { activityLogsMenu } from './menus/activityLogsMenu';

export const adminNavSection: { section: string; items: NavItem[] } = {
    section: 'Admin',
    items: [
        { ...sitesMenu, role: ['super_admin'] },
        { ...usersMenu, role: ['super_admin'] },
        activityLogsMenu,
        {
            title: 'Queue Monitor',
            path: '/queue-monitor',
            icon: Mail,
            role: ['admin', 'super_admin'],
        },
        {
            title: 'Docman Jobs',
            path: '/docman-jobs',
            icon: FileSearch,
            role: ['admin', 'super_admin'],
        },
        { ...surveysMenu, role: ['admin', 'super_admin'] },
        {
            title: 'Leads / CRM',
            path: '/leads',
            icon: UserCheck,
            role: ['admin', 'super_admin', 'customer_support'],
            dropdown: true,
            children: [
                {
                    title: 'All Leads',
                    path: '/leads',
                    icon: UserCheck,
                    role: ['admin', 'super_admin', 'customer_support'],
                },
            ],
        },
    ]
};
