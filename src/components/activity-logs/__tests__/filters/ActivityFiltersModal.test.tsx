import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityFiltersModal } from '../../filters/ActivityFiltersModal';

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
    it('renders with standardized Active Filters title and dark backdrop overlay', () => {
        render(<ActivityFiltersModal {...baseProps} />);

        expect(screen.getByText('Active Filters')).toBeInTheDocument();
        const hasDarkBackdropClass = Array.from(document.querySelectorAll('div')).some((el) =>
            el.classList.contains('bg-slate-900/60'),
        );
        expect(hasDarkBackdropClass).toBe(true);
    });

    it('closes modal when close button is clicked', () => {
        render(<ActivityFiltersModal {...baseProps} />);

        const closeButton = screen.getByRole('button', { name: /close filters/i });
        fireEvent.click(closeButton);

        expect(baseProps.setFiltersEnabled).toHaveBeenCalledWith(false);
    });

    it('closes modal when Escape key is pressed', () => {
        render(<ActivityFiltersModal {...baseProps} />);

        fireEvent.keyDown(window, { key: 'Escape' });

        expect(baseProps.setFiltersEnabled).toHaveBeenCalledWith(false);
    });
});

