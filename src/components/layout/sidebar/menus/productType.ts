import { Package, Syringe, Pill } from 'lucide-react';
import type { NavItem } from '../types';

export const productTypeMenu: NavItem = {
    title: 'Product Type',
    path: '/orders/product',
    icon: Package,
    children: [
        {
            title: 'Injectable',
            path: '/orders/product/injectable',
            icon: Syringe,
        },
        {
            title: 'Oral',
            path: '/orders/product/oral',
            icon: Pill,
        }
    ]
};
