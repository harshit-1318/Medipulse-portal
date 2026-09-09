import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderFiltersModal } from '../filters/components/OrderFiltersModal';

describe('OrderFiltersModal', () => {
    const mockProps = {
        filtersEnabled: true,
        setFiltersEnabled: vi.fn(),
        filters: {
            status: '',
            customer: '',
            repeatedOrders: '',
            products: '',
            documents: '',
            startDate: '',
            endDate: '',
            productCategory: '',
            productName: '',
            isUrgent: false,
            isParked: false,
        },
        updateFilter: vi.fn(),
        clearFilters: vi.fn(),
        localOrderId: '',
        setLocalOrderId: vi.fn(),
        localCustomerName: '',
        setLocalCustomerName: vi.fn(),
        localProductName: '',
        setLocalProductName: vi.fn(),
        pageType: 'all' as const,
    };

    it('does not render anything when filtersEnabled is false', () => {
        const { container } = render(
            <OrderFiltersModal {...mockProps} filtersEnabled={false} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders with z-100 overlay class and not portaled to document body', () => {
        const { container } = render(<OrderFiltersModal {...mockProps} />);

        // Should render directly in the local container
        expect(container.firstChild).not.toBeNull();

        const backdrop = container.querySelector('.fixed.inset-0');
        expect(backdrop).toBeInTheDocument();
        expect(backdrop).toHaveClass('z-100');
        expect(backdrop).toHaveClass('bg-slate-900/60');
        expect(backdrop).toHaveClass('backdrop-blur-md');
    });

    it('calls setFiltersEnabled(false) when Escape key is pressed', () => {
        render(<OrderFiltersModal {...mockProps} />);

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(mockProps.setFiltersEnabled).toHaveBeenCalledWith(false);
    });

    it('calls setFiltersEnabled(false) when clicking the backdrop outside the modal dialog', () => {
        const { container } = render(<OrderFiltersModal {...mockProps} />);

        const backdrop = container.querySelector('.fixed.inset-0') as HTMLElement;
        expect(backdrop).toBeInTheDocument();

        fireEvent.click(backdrop);
        expect(mockProps.setFiltersEnabled).toHaveBeenCalledWith(false);
    });

    it('does not close when clicking inside the modal content', () => {
        const setFiltersEnabled = vi.fn();
        render(<OrderFiltersModal {...mockProps} setFiltersEnabled={setFiltersEnabled} />);

        const header = screen.getByText('Active Filters');
        fireEvent.click(header);
        expect(setFiltersEnabled).not.toHaveBeenCalled();
    });

    it('renders Clear All and Search buttons', () => {
        render(<OrderFiltersModal {...mockProps} />);

        expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });
});
