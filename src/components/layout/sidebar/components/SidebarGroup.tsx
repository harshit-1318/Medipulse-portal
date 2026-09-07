import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

interface SidebarGroupProps {
    group: any;
    groupIndex: number;
    isCollapsed: boolean;
    isSectionOpen: boolean;
    onToggleSection: (name: string) => void;
    isActive: (path: string) => boolean;
    currentPath: string;
    openMenus: Record<string, boolean>;
    toggleMenu: (title: string, e: React.MouseEvent) => void;
    effectiveRole?: string;
}

export const SidebarGroup = ({
    group,
    groupIndex,
    isCollapsed,
    isSectionOpen,
    onToggleSection,
    isActive,
    currentPath,
    openMenus,
    toggleMenu,
    effectiveRole = '',
}: SidebarGroupProps) => {
    const sectionName = group.section || `section-${groupIndex}`;
    const isAllowed = (item: any) => {
        if (effectiveRole === 'super_admin') {
            return item.path !== '/dashboard';
        }
        if (!item.role || item.role.length === 0) return true;
        return item.role.includes(effectiveRole);
    };
    const visibleItems = group.items.filter(isAllowed);

    if (visibleItems.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            {group.section && !isCollapsed && (
                <button
                    onClick={() => onToggleSection(sectionName)}
                    className="w-full flex items-center justify-between px-3 mb-3 group/section transition-all"
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] group-hover/section:text-slate-600 transition-colors">
                            {group.section}
                        </span>
                        <div className="h-px bg-slate-100 flex-1 rounded-full group-hover/section:bg-slate-200 transition-colors"></div>
                    </div>
                    <motion.div
                        animate={{ rotate: isSectionOpen ? 0 : -90 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 text-slate-300 group-hover/section:text-slate-500"
                    >
                        <ChevronDown size={14} />
                    </motion.div>
                </button>
            )}

            <AnimatePresence initial={false}>
                {(isSectionOpen || isCollapsed) && (
                    <motion.div
                        initial={!isCollapsed ? { height: 0, opacity: 0 } : false}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className={`${isCollapsed ? 'overflow-visible' : 'overflow-hidden'} space-y-1`}
                    >
                        {visibleItems.map((item: any, itemIndex: number) => (
                            <SidebarNavItem
                                key={itemIndex}
                                item={item}
                                isCollapsed={isCollapsed}
                                isActive={isActive}
                                currentPath={currentPath}
                                isOpen={!!openMenus[item.title]}
                                onToggle={toggleMenu}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
