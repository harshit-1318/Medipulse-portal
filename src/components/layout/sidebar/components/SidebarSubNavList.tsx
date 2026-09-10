import { motion, AnimatePresence } from 'framer-motion';
import type { NavItem } from '../types';
import NestedSidebarNavItem from './NestedSidebarNavItem';

interface SidebarSubNavListProps {
    item: NavItem;
    isOpen: boolean;
    isCollapsed: boolean;
    currentPath: string;
}

export function SidebarSubNavList({ item, isOpen, isCollapsed, currentPath }: SidebarSubNavListProps) {
    if (!item.children || isCollapsed) return null;

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                >
                    <div className="flex flex-col gap-1.5 pl-8 pr-3 py-1 text-[13.5px]">
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
                </motion.div>
            )}
        </AnimatePresence>
    );
}
