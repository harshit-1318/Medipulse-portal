import {
    Activity,
    Building2,
    FileSearch,
    FileText,
    PlusCircle,
    Inbox,
    Mail,
    UserCheck,
} from 'lucide-react';
import type { NavItem } from '@/components/layout/sidebar/types';
import { usersMenu } from './menus/usersMenu';

export const adminNavSection: { section: string; items: NavItem[] } = {
    section: 'Admin',
    items: [
        {
            title: 'Sites',
            path: '/sites',
            icon: Building2,
            role: ['super_admin'],
            children: [
                {
                    title: 'List Sites',
                    path: '/sites',
                    icon: Building2,
                }
            ]
        },
        { ...usersMenu, role: ['super_admin'] },
        {
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
        },
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
        {
            title: 'Surveys',
            path: '/surveys',
            icon: FileText,
            role: ['admin', 'super_admin'],
            dropdown: true,
            color: '#00a294',
            children: [
                {
                    title: 'All Surveys',
                    path: '/surveys',
                    icon: FileText,
                    role: ['admin', 'super_admin'],
                },
                {
                    title: 'Create Survey',
                    path: '/surveys/create',
                    icon: PlusCircle,
                    role: ['admin', 'super_admin'],
                },
                {
                    title: 'All Responses',
                    path: '/surveys/responses',
                    icon: Inbox,
                    role: ['admin', 'super_admin'],
                },
            ],
        },
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
