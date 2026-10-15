import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterBadgesGroup } from '../table-header/components/FilterBadgesGroup';

describe('FilterBadgesGroup', () => {
    const mockBadges = [
        { label: 'Fulfillment: Unfulfilled', key: 'fulfillmentStatus', icon: () => <span data-testid="icon-fulfillment" /> },
        { label: 'ID: 1001', key: 'orderId', icon: () => <span data-testid="icon-order-id" /> },
        { label: 'Cust: Alice', key: 'customer', icon: () => <span data-testid="icon-customer" /> },
        { label: 'Prod: Oral', key: 'products', icon: () => <span data-testid="icon-products" /> },
    ];

    const defaultProps = {
        activeFilterBadges: mockBadges,
        removeFilterBadge: vi.fn(),
        showFilters: false,
        setShowFilters: vi.fn(),
    };

    it('renders badges up to 3 and "+1 more" counter when activeFilterBadges has 4 items', () => {
        render(<FilterBadgesGroup {...defaultProps} />);

        expect(screen.getByText('Fulfillment: Unfulfilled')).toBeInTheDocument();
        expect(screen.getByText('ID: 1001')).toBeInTheDocument();
        expect(screen.getByText('Cust: Alice')).toBeInTheDocument();
        expect(screen.queryByText('Prod: Oral')).not.toBeInTheDocument();
        expect(screen.getByText('+1 more')).toBeInTheDocument();
    });

    it('triggers removeFilterBadge when removing a removable badge', () => {
        const removeFilterBadge = vi.fn();
        render(<FilterBadgesGroup {...defaultProps} removeFilterBadge={removeFilterBadge} />);

        const badgeSpan = screen.getByText('Fulfillment: Unfulfilled');
        const removeBtn = badgeSpan.querySelector('button');
        expect(removeBtn).toBeDefined();

        if (removeBtn) {
            fireEvent.click(removeBtn);
            expect(removeFilterBadge).toHaveBeenCalledWith('fulfillmentStatus');
        }
    });

    it('does not render remove button if isRemovable is false', () => {
        const nonRemovableBadges = [
            { label: 'Fulfillment: Unfulfilled', key: 'fulfillmentStatus', icon: null, isRemovable: false }
        ];
        render(<FilterBadgesGroup {...defaultProps} activeFilterBadges={nonRemovableBadges} />);

        const badgeSpan = screen.getByText('Fulfillment: Unfulfilled');
        const removeBtn = badgeSpan.querySelector('button');
        expect(removeBtn).toBeNull();
        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getByText('Export')).toBeInTheDocument();
    });

    it('toggles filters when Filters button is clicked', () => {
        const setShowFilters = vi.fn();
        render(<FilterBadgesGroup {...defaultProps} setShowFilters={setShowFilters} showFilters={false} />);

        fireEvent.click(screen.getByText('Filters'));
        expect(setShowFilters).toHaveBeenCalledWith(true);
    });

    it('opens export modal when Export button is clicked', () => {
        render(<FilterBadgesGroup {...defaultProps} />);

        fireEvent.click(screen.getByText('Export'));
        expect(screen.getByText('Current Filters')).toBeInTheDocument();
        expect(screen.getByText('All Records')).toBeInTheDocument();
    });

    it('renders no badges when activeFilterBadges is empty', () => {
        render(<FilterBadgesGroup {...defaultProps} activeFilterBadges={[]} />);

        expect(screen.queryByText('+1 more')).not.toBeInTheDocument();
        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getByText('Export')).toBeInTheDocument();
    });
});
