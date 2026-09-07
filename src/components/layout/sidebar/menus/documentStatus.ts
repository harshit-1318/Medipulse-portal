import { FileText, FileCheck, FileX } from 'lucide-react';
import type { NavItem } from '../types';

export const documentStatusMenu: NavItem = {
    title: 'Document Status',
    path: '/orders/document',
    icon: FileText,
    children: [
        {
            title: 'Uploaded',
            path: '/orders/document/uploaded',
            icon: FileCheck,
        },
        {
            title: 'Not Uploaded',
            path: '/orders/document/not-uploaded',
            icon: FileX,
        }
    ]
};
