import React, { useState, useEffect, useRef } from 'react';
import { navItems } from '../constants';
import { isNavItemActive } from '../utils';
import { useSidebarRole } from './useSidebarRole';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'sidebar-collapsed';

export function useSidebarState(initialPath: string = '/dashboard') {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        const saved = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
        if (saved !== null) {
            setIsCollapsed(saved === 'true');
        }
    }, []);

    const [currentPath, setCurrentPath] = useState(initialPath);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'Dashboard': true,
        'Pages': true,
        'Admin': true,
    });
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const effectiveRole = useSidebarRole(currentPath, initialPath, mounted);

    const isActive = (path: string) => currentPath === path && path !== '#';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handlePathChange = () => setCurrentPath(window.location.pathname);
            handlePathChange();
            window.addEventListener('popstate', handlePathChange);
            return () => window.removeEventListener('popstate', handlePathChange);
        }
    }, []);

    useEffect(() => {
        const nextOpenMenus: Record<string, boolean> = { ...openMenus };
        let hasChanges = false;
        navItems.forEach((group) => {
            group.items.forEach((item) => {
                if (item.children && isNavItemActive(item, currentPath)) {
                    if (!nextOpenMenus[item.title]) {
                        nextOpenMenus[item.title] = true;
                        hasChanges = true;
                    }
                }
            });
        });
        if (hasChanges) setOpenMenus(nextOpenMenus);
    }, [currentPath, openMenus]);

    useEffect(() => {
        if (!isMounted.current) return;
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(isCollapsed));
    }, [isCollapsed]);

    const toggleMenu = (title: string, e: React.MouseEvent) => {
        e.preventDefault();
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    return {
        isCollapsed,
        setIsCollapsed,
        currentPath,
        openSections,
        openMenus,
        effectiveRole,
        isActive,
        toggleMenu,
        toggleSection,
    };
}
