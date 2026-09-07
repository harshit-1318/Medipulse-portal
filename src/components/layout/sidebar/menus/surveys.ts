import { FileText, PlusCircle, Inbox } from 'lucide-react';
import type { NavItem } from '../types';

export const surveysMenu: NavItem = {
    title: 'Surveys',
    path: '/surveys',
    icon: FileText,
    dropdown: true,
    color: '#00a294',
    children: [
        {
            title: 'All Surveys',
            path: '/surveys',
            icon: FileText,
        },
        {
            title: 'Create Survey',
            path: '/surveys/create',
            icon: PlusCircle,
        },
        {
            title: 'All Responses',
            path: '/surveys/responses',
            icon: Inbox,
        }
    ]
};
