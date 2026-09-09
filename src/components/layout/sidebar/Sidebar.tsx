import { navItems } from './constants';
import SidebarLogo from './components/SidebarLogo';
import { SidebarGroup } from './components/SidebarGroup';
import { useSidebarState } from './hooks/useSidebarState';

export { navItems } from './constants';
export type { NavItem } from './constants';

interface SidebarProps {
    initialPath?: string;
}

export default function Sidebar({ initialPath = '/dashboard' }: SidebarProps) {
    const {
        isCollapsed,
        setIsCollapsed,
        currentPath,
        openSections,
        openMenus,
        effectiveRole,
        isActive,
        toggleMenu,
        toggleSection,
    } = useSidebarState(initialPath);

    return (
        <aside
            className={`relative h-screen bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col shrink-0 transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-20' : 'w-70'}`}
            style={{ zIndex: 1000 }}
        >
            <SidebarLogo
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />

            <div className={`flex-1 overflow-y-auto py-6 px-3 custom-scrollbar ${isCollapsed ? 'overflow-x-visible' : 'overflow-x-hidden'}`}>
                {navItems.map((group, index) => (
                    <SidebarGroup
                        key={index}
                        group={group}
                        groupIndex={index}
                        isCollapsed={isCollapsed}
                        isSectionOpen={openSections[group.section || `section-${index}`] !== false}
                        onToggleSection={toggleSection}
                        isActive={isActive}
                        currentPath={currentPath}
                        openMenus={openMenus}
                        toggleMenu={toggleMenu}
                        effectiveRole={effectiveRole}
                    />
                ))}
            </div>
        </aside>
    );
}
