import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomersHeader } from '../components';
import RecordCount from '../table/RecordCount';
import TableActions from '../table/TableActions';
import { CustomersTable } from '../table';

describe('Standardized Customers UI Components', () => {
    it('renders clean Customers page header matching Orders format', () => {
        render(<CustomersHeader />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Customers');
        expect(heading.className).toContain('text-[22px]');
        expect(heading.className).toContain('font-bold');
    });

    it('renders RecordCount with typography and badge matching Orders', () => {
        render(<RecordCount total={42} />);
        const title = screen.getByText('Customers List');
        expect(title).toBeInTheDocument();
        expect(title.className).toContain('text-[18px]');
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders standardized Filters button and triggers toggle callback', () => {
        const setFiltersEnabled = vi.fn();
        render(
            <TableActions
                filtersEnabled={false}
                setFiltersEnabled={setFiltersEnabled}
                activeFiltersCount={0}
                activeFilterChips={[]}
                onRemoveFilter={vi.fn()}
                onClearFilters={vi.fn()}
            />
        );

        const filterBtn = screen.getByRole('button', { name: /Filters/i });
        expect(filterBtn).toBeInTheDocument();
        expect(filterBtn.className).toContain('text-[14px]');
        expect(filterBtn.className).toContain('font-semibold');

        fireEvent.click(filterBtn);
        expect(setFiltersEnabled).toHaveBeenCalledWith(true);
    });

    it('always renders pagination bar even for small counts matching OrderTable', () => {
        render(
            <CustomersTable
                customers={[]}
                total={5}
                page={1}
                limit={20}
                onPageChange={vi.fn()}
                filtersEnabled={false}
                setFiltersEnabled={vi.fn()}
                activeFiltersCount={0}
                sorting={[]}
                onSort={vi.fn()}
                activeFilterChips={[]}
                onRemoveFilter={vi.fn()}
                onClearFilters={vi.fn()}
            />
        );

        expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument();
    });
});
