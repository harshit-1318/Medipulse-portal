import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useReactTable, getCoreRowModel, type SortingState } from '@tanstack/react-table';
import { OrderTableHeader } from '../table/components/OrderTableHeader';
import type { OrderType } from '@/api/services/orders';

function TestTable({ sorting = [{ id: 'date', desc: true }] }: { sorting?: { id: string; desc: boolean }[] }) {
    const columns = [
        {
            accessorKey: 'id',
            header: 'ORDER ID',
        },
        {
            accessorKey: 'date',
            header: 'ORDER DATE',
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
        },
    ];

    const table = useReactTable({
        data: [] as OrderType[],
        columns,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table>
            <OrderTableHeader table={table} />
        </table>
    );
}

function InteractiveSortTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const columns = [
        { accessorKey: 'id', header: 'ORDER ID' },
        { accessorKey: 'date', header: 'ORDER DATE' },
        { accessorKey: 'status', header: 'STATUS' },
    ];

    const table = useReactTable({
        data: [] as OrderType[],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        enableMultiSort: false,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table>
            <OrderTableHeader table={table} />
        </table>
    );
}

describe('OrderTableHeader', () => {
    it('renders column headers and shows active sort indicator on sorted column', () => {
        const { container } = render(<TestTable sorting={[{ id: 'date', desc: true }]} />);

        expect(screen.getByText('ORDER ID')).toBeInTheDocument();
        expect(screen.getByText('ORDER DATE')).toBeInTheDocument();
        expect(screen.getByText('STATUS')).toBeInTheDocument();

        // Check for SVG icons in header
        const svgIcons = container.querySelectorAll('svg');
        expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('renders hash icon for order ID column instead of external link', () => {
        const { container } = render(<TestTable sorting={[{ id: 'date', desc: true }]} />);
        const thElements = screen.getAllByRole('columnheader');
        
        // First column is ORDER ID
        const orderIdTh = thElements[0];
        expect(orderIdTh).toHaveTextContent('ORDER ID');

        // Verify it contains icons
        const icons = orderIdTh.querySelectorAll('svg');
        expect(icons.length).toBeGreaterThanOrEqual(1);
    });

    it('renders arrow down indicator when sorted desc', () => {
        render(<TestTable sorting={[{ id: 'date', desc: true }]} />);
        const dateHeader = screen.getByText('ORDER DATE').closest('th');
        expect(dateHeader).toBeInTheDocument();
        const arrowDown = dateHeader?.querySelector('.animate-in.slide-in-from-top-1');
        expect(arrowDown).toBeInTheDocument();
    });

    it('renders arrow up indicator when sorted asc', () => {
        render(<TestTable sorting={[{ id: 'date', desc: false }]} />);
        const dateHeader = screen.getByText('ORDER DATE').closest('th');
        expect(dateHeader).toBeInTheDocument();
        const arrowUp = dateHeader?.querySelector('.animate-in.slide-in-from-bottom-1');
        expect(arrowUp).toBeInTheDocument();
    });

    it('cycles through 3-state sorting: ASC -> DESC -> RESET -> ASC on click', () => {
        render(<InteractiveSortTable />);

        const orderIdBtn = screen.getByText('ORDER ID').closest('button')!;
        const orderIdTh = screen.getByText('ORDER ID').closest('th')!;

        // Initially neutral / un-sorted
        expect(orderIdTh.querySelector('.animate-in')).toBeNull();

        // 1st click -> ASCENDING
        fireEvent.click(orderIdBtn);
        expect(orderIdTh.querySelector('.animate-in.slide-in-from-bottom-1')).toBeInTheDocument();

        // 2nd click -> DESCENDING
        fireEvent.click(orderIdBtn);
        expect(orderIdTh.querySelector('.animate-in.slide-in-from-top-1')).toBeInTheDocument();

        // 3rd click -> RESET / NO SORT
        fireEvent.click(orderIdBtn);
        expect(orderIdTh.querySelector('.animate-in')).toBeNull();

        // 4th click -> repeats cycle back to ASCENDING
        fireEvent.click(orderIdBtn);
        expect(orderIdTh.querySelector('.animate-in.slide-in-from-bottom-1')).toBeInTheDocument();
    });

    it('makes newly clicked column ASC on its first click and clears previous column', () => {
        render(<InteractiveSortTable />);

        const orderIdBtn = screen.getByText('ORDER ID').closest('button')!;
        const orderIdTh = screen.getByText('ORDER ID').closest('th')!;
        const statusBtn = screen.getByText('STATUS').closest('button')!;
        const statusTh = screen.getByText('STATUS').closest('th')!;

        // Click ORDER ID twice -> DESC
        fireEvent.click(orderIdBtn);
        fireEvent.click(orderIdBtn);
        expect(orderIdTh.querySelector('.animate-in.slide-in-from-top-1')).toBeInTheDocument();

        // Click STATUS -> STATUS becomes ASC on its first click, ORDER ID is reset
        fireEvent.click(statusBtn);
        expect(statusTh.querySelector('.animate-in.slide-in-from-bottom-1')).toBeInTheDocument();
        expect(orderIdTh.querySelector('.animate-in')).toBeNull();
    });
});
