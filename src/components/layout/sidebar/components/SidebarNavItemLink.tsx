import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '../types';

interface SidebarNavItemLinkProps {
    item: NavItem;
    isCollapsed: boolean;
    isParentActive: boolean;
    hasChildren: boolean;
    isOpen: boolean;
    triggerRef: React.RefObject<HTMLAnchorElement | null>;
    onToggle: (title: string, e: React.MouseEvent) => void;
    openFlyout: () => void;
    scheduleCloseFlyout: () => void;
}

export const SidebarNavItemLink: React.FC<SidebarNavItemLinkProps> = ({
    item,
    isCollapsed,
    isParentActive,
    hasChildren,
    isOpen,
    triggerRef,
    onToggle,
    openFlyout,
    scheduleCloseFlyout,
}) => {
    const Icon = item.icon;

    return (
        <a
            ref={triggerRef}
            href={hasChildren ? '#' : item.path}
            onClick={hasChildren && !isCollapsed ? (e) => onToggle(item.title, e) : undefined}
            onMouseEnter={openFlyout}
            onMouseLeave={scheduleCloseFlyout}
            onFocus={openFlyout}
            onBlur={scheduleCloseFlyout}
            className={`group relative flex items-center flex-nowrap gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-300 text-[14px]
                ${isParentActive && !hasChildren
                    ? 'bg-[#00a294]/8 border border-[#00a294]/10 text-[#00a294] font-bold shadow-sm'
                    : isParentActive && hasChildren
                        ? 'text-[#1e293b] font-bold'
                        : 'text-slate-500 hover:bg-[#f8fafc] hover:text-slate-900 font-semibold'
                }
                ${isCollapsed ? 'justify-center px-0' : 'justify-start'}
            `}
            title={isCollapsed ? item.title : undefined}
        >
            {isParentActive && !isCollapsed && !hasChildren && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute -left-3 w-1.5 h-6 bg-[#00a294] rounded-r-full shadow-[0_0_12px_rgba(0,162,148,0.3)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}

            <Icon
                size={22}
                className={`shrink-0 transition-all duration-300
                    ${isParentActive && hasChildren
                        ? 'text-[#1e293b] scale-110'
                        : isParentActive
                            ? 'text-[#00a294] scale-110'
                            : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110'}
                `}
                strokeWidth={isParentActive ? 2 : 1.5}
            />

            {!isCollapsed && (
                <span className="flex-1 min-w-0 text-left tracking-tight whitespace-normal leading-snug pr-1">
                    {item.title}
                </span>
            )}

            {!isCollapsed && hasChildren && (
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className={`shrink-0 ${isParentActive && hasChildren ? 'text-[#1e293b]' : isParentActive ? 'text-[#00a294]' : 'text-slate-300 group-hover:text-slate-500'}`}
                >
                    <ChevronDown size={16} strokeWidth={2} />
                </motion.div>
            )}
        </a>
    );
};
