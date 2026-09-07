import type { NavItem } from './types';

/**
 * Recursively checks if a NavItem or any of its children matches the current path.
 * This is used to highlight parent dropdowns and auto-expand them.
 */
export function isNavItemActive(item: NavItem, currentPath: string): boolean {
    // Exact match for the item itself
    // We treat '#' as not active on its own (it's a dropdown parent)
    if (item.path !== '#' && currentPath === item.path) {
        return true;
    }

    // Recursively check children
    if (item.children && item.children.length > 0) {
        return item.children.some(child => isNavItemActive(child, currentPath));
    }

    return false;
}
