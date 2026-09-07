import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SidebarGroup } from '../components/SidebarGroup';

vi.mock('../components/SidebarNavItem', () => ({
    default: ({ item }: any) => <div data-testid="sidebar-nav-item">{item.title}</div>
}));

describe('SidebarGroup Rendering', () => {
    const mockGroup = {
        section: 'Admin',
        items: [
            { title: 'Dashboard', path: '/dashboard' },
            { title: 'Orders', path: '/orders' }
        ]
    };

    const mockProps = {
        group: mockGroup,
        groupIndex: 0,
        isCollapsed: false,
        isSectionOpen: true,
        onToggleSection: vi.fn(),
        isActive: vi.fn((path) => path === '/dashboard'),
        currentPath: '/dashboard',
        openMenus: {},
        toggleMenu: vi.fn()
    };

    it('renders the section title when not collapsed', () => {
        render(<SidebarGroup {...mockProps} />);
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('renders the items when section is open', () => {
        render(<SidebarGroup {...mockProps} />);
        const items = screen.getAllByTestId('sidebar-nav-item');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('Dashboard');
        expect(items[1]).toHaveTextContent('Orders');
    });

    it('calls onToggleSection when section header is clicked', () => {
        render(<SidebarGroup {...mockProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockProps.onToggleSection).toHaveBeenCalledWith('Admin');
    });

    it('hides items when section is closed and not collapsed', () => {
        render(<SidebarGroup {...mockProps} isSectionOpen={false} />);
        expect(screen.queryByTestId('sidebar-nav-item')).not.toBeInTheDocument();
    });
});
