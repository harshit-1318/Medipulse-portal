import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SidebarGroup } from '../components/SidebarGroup';

vi.mock('../components/SidebarNavItem', () => ({
    default: ({ item }: any) => <div data-testid="sidebar-nav-item">{item.title}</div>
}));

describe('SidebarGroup Roles & Layout', () => {
    const mockProps = {
        group: { section: 'Admin', items: [{ title: 'Dashboard', path: '/dashboard' }] },
        groupIndex: 0,
        isCollapsed: false,
        isSectionOpen: true,
        onToggleSection: vi.fn(),
        isActive: vi.fn((path) => path === '/dashboard'),
        currentPath: '/dashboard',
        openMenus: {},
        toggleMenu: vi.fn()
    };

    it('hides section when role cannot access any item', () => {
        const restrictedGroup = {
            section: 'Admin',
            items: [{ title: 'Docman', path: '/docman-jobs', role: ['admin'] }]
        };

        render(
            <SidebarGroup
                {...mockProps}
                group={restrictedGroup}
                effectiveRole="prescriber"
            />
        );

        expect(screen.queryByText('Admin')).not.toBeInTheDocument();
        expect(screen.queryByTestId('sidebar-nav-item')).not.toBeInTheDocument();
    });

    it('renders items for super_admin even if item specifies other roles', () => {
        const restrictedGroup = {
            section: 'Admin',
            items: [{ title: 'Docman', path: '/docman-jobs', role: ['admin'] }]
        };

        render(
            <SidebarGroup
                {...mockProps}
                group={restrictedGroup}
                effectiveRole="super_admin"
            />
        );

        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar-nav-item')).toHaveTextContent('Docman');
    });

    it('hides standard /dashboard for super_admin to prevent duplicate overview', () => {
        const dashboardGroup = {
            section: 'Dashboard',
            items: [
                { title: 'Overview', path: '/dashboard' },
                { title: 'Super Admin Overview', path: '/super-dashboard', role: ['super_admin'] }
            ]
        };

        render(
            <SidebarGroup
                {...mockProps}
                group={dashboardGroup}
                effectiveRole="super_admin"
            />
        );

        const items = screen.getAllByTestId('sidebar-nav-item');
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveTextContent('Super Admin Overview');
    });

    it('uses overflow-visible when collapsed so flyout submenus are not clipped', () => {
        const { container } = render(
            <SidebarGroup
                {...mockProps}
                isCollapsed={true}
            />
        );

        expect(container.querySelector('.overflow-visible')).toBeInTheDocument();
    });
});
