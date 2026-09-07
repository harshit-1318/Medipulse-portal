import { Truck, PauseCircle, TriangleAlert, CheckCircle2, XCircle } from 'lucide-react';
import type { NavItem } from '../types';

export const orderStatusMenu: NavItem = {
    title: 'Order Status',
    path: '/orders/status',
    icon: Truck,
    children: [
        {
            title: 'On Hold',
            path: '/orders/status/on-hold',
            icon: PauseCircle,
        },
        {
            title: 'Unfulfilled',
            path: '/orders/status/unfulfilled',
            icon: TriangleAlert,
        },
        {
            title: 'Fulfilled',
            path: '/orders/status/fulfilled',
            icon: CheckCircle2,
        },
        {
            title: 'Cancelled',
            path: '/orders/status/cancelled',
            icon: XCircle,
        }
    ]
};
