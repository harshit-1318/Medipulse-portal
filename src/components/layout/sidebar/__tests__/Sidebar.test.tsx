import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Sidebar from '../Sidebar';

vi.mock('../components/SidebarLogo', () => ({
    default: ({ isCollapsed, onToggle }: any) => (
        <button type="button" onClick={onToggle} data-collapsed={isCollapsed ? 'true' : 'false'}>
            Toggle Sidebar
        </button>
    ),
}));

vi.mock('../components/SidebarGroup', () => ({
    SidebarGroup: () => <div data-testid="sidebar-group" />,
}));

vi.mock('@/store', () => ({
    useUserStore: (selector: any) => selector({ user: { effectiveRole: 'admin' } }),
}));

describe('Sidebar', () => {
    beforeEach(() => {
        localStorage.clear();
        window.history.replaceState({}, '', '/dashboard');
    });

    it('restores collapsed state from localStorage and persists toggle updates', () => {
        localStorage.setItem('sidebar-collapsed', 'true');

        const { container } = render(<Sidebar initialPath="/dashboard" />);
        const aside = container.querySelector('aside');

        expect(aside).toHaveClass('w-20');

        fireEvent.click(container.querySelector('button') as HTMLButtonElement);

        expect(localStorage.getItem('sidebar-collapsed')).toBe('false');
    });
});
