import { Activity } from 'lucide-react';
import type { NavItem } from '../types';

export const activityLogsMenu: NavItem = {
    title: 'Activity Logs',
    path: '/activity-logs',
    icon: Activity,
    role: ['admin', 'super_admin'],
    children: [
        {
            title: 'All Activity',
            path: '/activity-logs',
            icon: Activity,
        },
        {
            title: 'Email History',
            path: '/activity-logs/email-history',
            icon: Activity,
        },
    ],
};
