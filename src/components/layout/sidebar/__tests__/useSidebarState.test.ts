import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useSidebarState } from '../hooks/useSidebarState';

const mockUseUserStore = vi.fn();
vi.mock('@/store', () => ({
    useUserStore: (selector: any) => mockUseUserStore(selector),
}));

describe('useSidebarState', () => {
    beforeEach(() => {
        localStorage.clear();
        mockUseUserStore.mockImplementation((selector: any) =>
            selector({ user: { effectiveRole: 'admin' } })
        );
    });

    it('resolves effective role to user initially and updates to store role post-mount', () => {
        const { result } = renderHook(() => useSidebarState('/dashboard'));

        // Post-mount (after useEffect runs in renderHook)
        expect(result.current.effectiveRole).toBe('admin');
        expect(result.current.isCollapsed).toBe(false);
    });

    it('resolves super_admin for /super-dashboard path', () => {
        mockUseUserStore.mockImplementation((selector: any) => selector({ user: null }));
        window.history.replaceState({}, '', '/super-dashboard');

        const { result } = renderHook(() => useSidebarState('/super-dashboard'));
        expect(result.current.effectiveRole).toBe('super_admin');
    });

    it('allows toggling sections and menus', () => {
        const { result } = renderHook(() => useSidebarState('/dashboard'));

        expect(result.current.openSections['Dashboard']).toBe(true);

        act(() => {
            result.current.toggleSection('Dashboard');
        });
        expect(result.current.openSections['Dashboard']).toBe(false);

        act(() => {
            result.current.toggleMenu('Orders', { preventDefault: () => {} } as any);
        });
        expect(result.current.openMenus['Orders']).toBe(true);
    });

    it('toggles collapsed state and updates localStorage', () => {
        const { result } = renderHook(() => useSidebarState('/dashboard'));

        act(() => {
            result.current.setIsCollapsed(true);
        });

        expect(result.current.isCollapsed).toBe(true);
        expect(localStorage.getItem('sidebar-collapsed')).toBe('true');
    });
});
