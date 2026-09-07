import { Building2 } from 'lucide-react';
import type { NavItem } from '../types';

export const sitesMenu: NavItem = {
    title: 'Sites',
    path: '/sites',
    icon: Building2,
    children: [
        {
            title: 'List Sites',
            path: '/sites',
            icon: Building2,
        }
    ]
};
