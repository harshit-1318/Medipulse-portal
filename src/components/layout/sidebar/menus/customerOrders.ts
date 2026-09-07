import { Users, UserPlus, Repeat } from 'lucide-react';
import type { NavItem } from '../types';

export const customerOrdersMenu: NavItem = {
    title: 'Customer Orders',
    path: '#',
    icon: Users,
    dropdown: true,
    children: [
        {
            title: 'First',
            path: '/orders/customer/first',
            icon: UserPlus,
        },
        {
            title: 'Repeat Orders',
            path: '/orders/customer/repeat',
            icon: Repeat,
        }
    ]
};
