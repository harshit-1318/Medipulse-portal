import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityFiltersModal } from './ActivityFiltersModal';

vi.mock('framer-motion', () => ({
    AnimatePresence: ({ children }: any) => children,
    m: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

const baseProps = {
    filtersEnabled: true,
    setFiltersEnabled: vi.fn(),
    filters: {
        action: '',
        startDate: '',
        endDate: '',
        search: '',
        orderId: '',
    },
    updateFilter: vi.fn(),
    clearFilters: vi.fn(),
    localSearch: '',
    setLocalSearch: vi.fn(),
    localOrderId: '',
    setLocalOrderId: vi.fn(),
    siteOptions: [],
};

describe('ActivityFiltersModal', () => {
    it('renders without dark backdrop overlay class', () => {
        render(<ActivityFiltersModal {...baseProps} />);

        expect(screen.getByText('Filter Activity')).toBeInTheDocument();
        const hasDarkBackdropClass = Array.from(document.querySelectorAll('div')).some((el) =>
            el.classList.contains('bg-slate-900/60'),
        );
        expect(hasDarkBackdropClass).toBe(false);
    });

    it('closes modal when close button is clicked', () => {
        render(<ActivityFiltersModal {...baseProps} />);

        const closeButton = screen.getByRole('button', { name: /close filters/i });
        fireEvent.click(closeButton);

        expect(baseProps.setFiltersEnabled).toHaveBeenCalledWith(false);
    });
});
