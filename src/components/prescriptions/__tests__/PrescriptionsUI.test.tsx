import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PrescriptionsHeader from '../components/PrescriptionsHeader';
import ActiveFilterChips from '../filters/ActiveFilterChips';
import PrescriptionsTable from '../table/PrescriptionsTable';

describe('Standardized Prescriptions UI Components', () => {
    it('renders clean Prescriptions page header matching Orders format', () => {
        render(<PrescriptionsHeader />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Prescriptions');
        expect(heading.className).toContain('text-[22px]');
        expect(heading.className).toContain('font-bold');
    });

    it('renders active filter chips with remove button matching Orders badge style', () => {
        const onRemove = vi.fn();
        render(
            <ActiveFilterChips
                chips={[{ key: 'orderId', label: 'Order ID', value: 'YM-1002' }]}
                onRemove={onRemove}
            />
        );

        expect(screen.getByText('Order ID:')).toBeInTheDocument();
        expect(screen.getByText('YM-1002')).toBeInTheDocument();

        const removeBtn = screen.getByTitle('Remove Order ID filter');
        fireEvent.click(removeBtn);
        expect(onRemove).toHaveBeenCalledWith('orderId');
    });

    it('renders standardized Filters button and always displays pagination bar', () => {
        const setFiltersEnabled = vi.fn();
        const onPageChange = vi.fn();

        render(
            <PrescriptionsTable
                prescriptions={[]}
                total={0}
                page={1}
                limit={20}
                onPageChange={onPageChange}
                filtersEnabled={false}
                setFiltersEnabled={setFiltersEnabled}
                sorting={[]}
                onSortingChange={vi.fn()}
                activeFilterChips={[]}
                onRemoveFilter={vi.fn()}
                onClearFilters={vi.fn()}
            />
        );

        const filterBtn = screen.getByRole('button', { name: /Filters/i });
        expect(filterBtn).toBeInTheDocument();
        expect(filterBtn.className).toContain('text-[14px]');
        expect(filterBtn.className).toContain('font-semibold');

        // Pagination should be visible even when total <= limit
        expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument();

        fireEvent.click(filterBtn);
        expect(setFiltersEnabled).toHaveBeenCalledWith(true);
    });
});
