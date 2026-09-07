import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '../types';
import { isNavItemActive } from '../utils';
import { SubNavGroup } from './SubNavGroup';

interface NestedSidebarNavItemProps {
    child: NavItem;
    currentPath: string;
    hasSubChildren: boolean | undefined;
}

export default function NestedSidebarNavItem({
    child,
    currentPath,
    hasSubChildren,
}: NestedSidebarNavItemProps) {
    const isChildActive = hasSubChildren && isNavItemActive(child, currentPath);
    const [subOpen, setSubOpen] = React.useState(!!isChildActive);
    const ChildIcon = child.icon;
    const exactActive = currentPath === child.path;

    useEffect(() => {
        if (isChildActive && !subOpen) {
            setSubOpen(true);
        }
    }, [currentPath, isChildActive]);

    if (!hasSubChildren) {
        return (
            <a
                href={child.path}
                className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 
                    ${exactActive
                        ? 'text-[#00a294] font-bold bg-[#00a294]/8 border border-[#00a294]/10 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-[#f8fafc] font-semibold'
                    }`}
            >
                {ChildIcon && (
                    <ChildIcon
                        size={18}
                        className={`shrink-0 transition-all duration-300 ${exactActive ? 'text-[#00a294] scale-110' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110'}`}
                        strokeWidth={exactActive ? 2 : 1.5}
                    />
                )}
                <span className="flex-1 min-w-0 text-left tracking-tight whitespace-normal leading-snug pr-1">{child.title}</span>
                {exactActive && (
                    <motion.div
                        layoutId="nav-dot"
                        className="w-1.5 h-1.5 rounded-full bg-[#00a294] shadow-[0_0_8px_rgba(0,162,148,0.4)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                )}
            </a>
        );
    }

    const isParentActive = isChildActive || exactActive;

    return (
        <div className="flex flex-col gap-1.5">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setSubOpen(!subOpen);
                }}
                className={`group relative flex items-center justify-between w-full px-3 py-2 rounded-xl transition-all duration-300 
                    ${isParentActive
                        ? 'text-[#00a294] font-bold bg-[#00a294]/8 border border-[#00a294]/10 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-[#f8fafc] font-semibold'
                    }`}
            >
                <div className="flex items-center gap-2.5">
                    {ChildIcon && (
                        <ChildIcon
                            size={18}
                            className={`transition-all duration-300 ${isParentActive ? 'text-[#00a294] scale-110' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110'}`}
                            strokeWidth={isParentActive ? 2 : 1.5}
                        />
                    )}
                    <span className="flex-1 min-w-0 tracking-tight whitespace-normal leading-snug text-left pr-1">{child.title}</span>
                </div>
                <motion.div
                    animate={{ rotate: subOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className={`shrink-0 ${isParentActive ? 'text-[#00a294]' : 'text-slate-300 group-hover:text-slate-500'}`}
                >
                    <ChevronDown size={14} strokeWidth={2} />
                </motion.div>
            </button>

            <SubNavGroup subOpen={subOpen} currentPath={currentPath}>
                {child.children || []}
            </SubNavGroup>
        </div>
    );
}
