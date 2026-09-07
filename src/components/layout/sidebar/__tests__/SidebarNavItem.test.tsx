import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SidebarNavItem from '../components/SidebarNavItem';

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
    ChevronDown: () => <svg data-testid="chevron-down" />,
}));

vi.mock('../components/NestedSidebarNavItem', () => ({
    default: ({ child }: any) => <div>{child.title}</div>,
}));

describe('SidebarNavItem', () => {
    const baseItem = {
        title: 'Activity Logs',
        path: '/activity-logs',
        icon: () => <svg data-testid="item-icon" />,
        children: [
            {
                title: 'All Activity',
                path: '/activity-logs',
                icon: () => <svg />,
            },
            {
                title: 'Email History',
                path: '/activity-logs/email-history',
                icon: () => <svg />,
            },
        ],
    };

    it('opens collapsed flyout content on hover for items with children', () => {
        render(
            <SidebarNavItem
                item={baseItem as any}
                isCollapsed={true}
                isActive={() => false}
                currentPath="/dashboard"
                isOpen={false}
                onToggle={vi.fn()}
            />
        );

        fireEvent.mouseEnter(screen.getByRole('link', { name: /activity logs/i }));

        expect(screen.getByText('All Activity')).toBeInTheDocument();
        expect(screen.getByText('Email History')).toBeInTheDocument();
    });

    it('does not toggle dropdown on click while collapsed', () => {
        const onToggle = vi.fn();

        render(
            <SidebarNavItem
                item={baseItem as any}
                isCollapsed={true}
                isActive={() => false}
                currentPath="/dashboard"
                isOpen={false}
                onToggle={onToggle}
            />
        );

        fireEvent.click(screen.getByRole('link'));
        expect(onToggle).not.toHaveBeenCalled();
    });

    it('toggles dropdown on click when expanded', () => {
        const onToggle = vi.fn();

        render(
            <SidebarNavItem
                item={baseItem as any}
                isCollapsed={false}
                isActive={() => false}
                currentPath="/dashboard"
                isOpen={false}
                onToggle={onToggle}
            />
        );

        fireEvent.click(screen.getByRole('link', { name: /activity logs/i }));
        expect(onToggle).toHaveBeenCalledTimes(1);
    });
});
