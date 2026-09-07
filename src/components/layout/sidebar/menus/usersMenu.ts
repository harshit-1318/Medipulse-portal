import { UsersRound, UserPlus } from 'lucide-react';
import type { NavItem } from '../types';

export const usersMenu: NavItem = {
    title: 'Users',
    path: '/users',
    icon: UsersRound,
    children: [
        {
            title: 'List Users',
            path: '/users',
            icon: UsersRound,
        },
        {
            title: 'Create User',
            path: '/users/create',
            icon: UserPlus,
        }
    ]
};
