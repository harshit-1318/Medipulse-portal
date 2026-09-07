import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SidebarLogo from '../components/SidebarLogo';

const mockUseSiteInfo = vi.fn();
const mockUseUserInfo = vi.fn();

vi.mock('@/store', () => ({
    useSiteInfo: () => mockUseSiteInfo(),
    useUserInfo: () => mockUseUserInfo(),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
    ArrowLeftToLine: () => <svg data-testid="arrow-left" />, 
    ArrowRightToLine: () => <svg data-testid="arrow-right" />,
}));

describe('SidebarLogo', () => {
    it('shows site logo and small icon from site settings', () => {
        mockUseSiteInfo.mockReturnValue({
            logo: 'https://cdn.example.com/sites/rx/full-logo.svg',
            small_icon_url: 'https://cdn.example.com/sites/rx/small-icon.png',
            name: 'RX Clinic',
        });

        const onToggle = vi.fn();
        const { rerender } = render(<SidebarLogo isCollapsed={false} onToggle={onToggle} />);

        const fullLogo = screen.getByRole('img', { name: 'RX Clinic' });
        expect(fullLogo).toHaveAttribute('src', 'https://cdn.example.com/sites/rx/full-logo.svg');

        rerender(<SidebarLogo isCollapsed={true} onToggle={onToggle} />);

        const smallIcon = screen.getByRole('img', { name: 'MP' });
        expect(smallIcon).toHaveAttribute('src', 'https://cdn.example.com/sites/rx/small-icon.png');

        fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));
        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('falls back to static branding assets when site settings logos are missing', () => {
        mockUseSiteInfo.mockReturnValue({ logo: '', small_icon_url: '', name: '' });

        const { rerender } = render(<SidebarLogo isCollapsed={false} onToggle={() => {}} />);

        const fullLogo = screen.getByRole('img', { name: 'MediPulse' });
        expect(fullLogo.getAttribute('src')).toContain('/medipulse-logo.svg');

        rerender(<SidebarLogo isCollapsed={true} onToggle={() => {}} />);

        const smallIcon = screen.getByRole('img', { name: 'MP' });
        expect(smallIcon).toHaveAttribute('src', '/favicon.svg');
    });
});
