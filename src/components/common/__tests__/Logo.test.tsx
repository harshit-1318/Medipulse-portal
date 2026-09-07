import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Logo from '../Logo';

const mockUseSiteInfo = vi.fn();

vi.mock('@/store', () => ({
    useSiteInfo: () => mockUseSiteInfo(),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

describe('Logo', () => {
    it('renders logo from site settings when logo URL exists', () => {
        mockUseSiteInfo.mockReturnValue({
            logo: 'https://cdn.example.com/sites/rx/logo.png',
            name: 'RX Clinic',
        });

        render(<Logo />);

        const img = screen.getByRole('img', { name: 'RX Clinic' });
        expect(img).toHaveAttribute('src', 'https://cdn.example.com/sites/rx/logo.png');
    });

    it('falls back to default branding logo when site logo is empty (dark mode vs light mode)', () => {
        mockUseSiteInfo.mockReturnValue({
            logo: '',
            name: '',
        });

        const { rerender } = render(<Logo isDark={true} />);
        let img = screen.getByRole('img', { name: 'MediPulse' });
        expect(img.getAttribute('src')).toContain('/medipulse-logo-dark.svg');

        rerender(<Logo isDark={false} />);
        img = screen.getByRole('img', { name: 'MediPulse' });
        expect(img.getAttribute('src')).toContain('/medipulse-logo.svg');
    });
});
