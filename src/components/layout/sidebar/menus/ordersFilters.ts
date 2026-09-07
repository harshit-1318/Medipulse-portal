import { Filter, ClipboardList, AlertTriangle, ParkingSquare } from 'lucide-react';
import type { NavItem } from '../types';
import { customerOrdersMenu } from './customerOrders';
import { orderStatusMenu } from './orderStatus';
import { documentStatusMenu } from './documentStatus';
import { productTypeMenu } from './productType';
import { categoriesMenu } from './categories';

export const ordersFiltersMenu: NavItem = {
    title: 'Orders Filters',
    path: '#',
    icon: Filter,
    dropdown: true,
    children: [
        {
            title: 'All Orders',
            path: '/orders/all',
            icon: ClipboardList,
        },
        {
            title: 'Urgent Orders',
            path: '/orders/urgent',
            icon: AlertTriangle,
        },
        {
            title: 'Parked Orders',
            path: '/orders/parked',
            icon: ParkingSquare,
        },
        customerOrdersMenu,
        orderStatusMenu,
        documentStatusMenu,
        productTypeMenu,
        categoriesMenu
    ]
};
