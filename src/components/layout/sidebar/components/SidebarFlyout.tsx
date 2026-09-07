import { createPortal } from 'react-dom';
import type { NavItem } from '../types';
import NestedSidebarNavItem from './NestedSidebarNavItem';

interface SidebarFlyoutProps {
    item: NavItem;
    flyoutPosition: { top: number; left: number };
    currentPath: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export function SidebarFlyout({
    item,
    flyoutPosition,
    currentPath,
    onMouseEnter,
    onMouseLeave,
}: SidebarFlyoutProps) {
    if (typeof document === 'undefined' || !item.children) return null;

    return createPortal(
        <div
            className="fixed w-72"
            style={{
                top: flyoutPosition.top,
                left: flyoutPosition.left,
                zIndex: 2000,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
                <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {item.title}
                </div>
                <div className="flex flex-col gap-1.5 px-1 pb-1 text-[13.5px]">
                    {item.children.map((child, childIndex) => {
                        const hasSubChildren = child.children && child.children.length > 0;
                        return (
                            <NestedSidebarNavItem
                                key={childIndex}
                                child={child}
                                currentPath={currentPath}
                                hasSubChildren={hasSubChildren}
                            />
                        );
                    })}
                </div>
            </div>
        </div>,
        document.body
    );
}
