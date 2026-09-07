import React from 'react';
import type { NavItem } from '../types';
import { isNavItemActive } from '../utils';
import { SidebarFlyout } from './SidebarFlyout';
import { useSidebarFlyoutHover } from '../hooks/useSidebarFlyoutHover';
import { SidebarSubNavList } from './SidebarSubNavList';
import { SidebarNavItemLink } from './SidebarNavItemLink';

interface SidebarNavItemProps {
    item: NavItem;
    isCollapsed: boolean;
    isActive: (path: string) => boolean;
    currentPath: string;
    isOpen: boolean;
    onToggle: (title: string, e: React.MouseEvent) => void;
}

export default function SidebarNavItem({
    item,
    isCollapsed,
    isActive,
    currentPath,
    isOpen,
    onToggle
}: SidebarNavItemProps) {
    const active = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isChildActive = hasChildren && isNavItemActive(item, currentPath);
    const isParentActive = active || isChildActive;

    const {
        triggerRef,
        isFlyoutOpen,
        flyoutPosition,
        openFlyout,
        scheduleCloseFlyout,
    } = useSidebarFlyoutHover(isCollapsed, !!hasChildren);

    return (
        <div className="relative flex flex-col gap-1 group/nav-item">
            <SidebarNavItemLink
                item={item}
                isCollapsed={isCollapsed}
                isParentActive={Boolean(isParentActive)}
                hasChildren={Boolean(hasChildren)}
                isOpen={isOpen}
                triggerRef={triggerRef}
                onToggle={onToggle}
                openFlyout={openFlyout}
                scheduleCloseFlyout={scheduleCloseFlyout}
            />

            {hasChildren && isCollapsed && isFlyoutOpen && (
                <SidebarFlyout
                    item={item}
                    flyoutPosition={flyoutPosition}
                    currentPath={currentPath}
                    onMouseEnter={openFlyout}
                    onMouseLeave={scheduleCloseFlyout}
                />
            )}

            <SidebarSubNavList
                item={item}
                isOpen={isOpen}
                isCollapsed={isCollapsed}
                currentPath={currentPath}
            />
        </div>
    );
}
