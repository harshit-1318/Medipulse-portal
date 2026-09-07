import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderFiltersForm } from "../filters/components/OrderFiltersForm";

vi.mock('@/components/orders-table/ui', () => ({
    default: ({ label, value, onChange }: any) => (
        <div data-testid="custom-dropdown">
            <label>{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">All</option>
                <option value="test">Test Option</option>
            </select>
        </div>
    )
}));

describe('OrderFiltersForm', () => {
    const mockProps = {
        filters: { status: '', repeatedOrders: '' },
        updateFilter: vi.fn(),
        localOrderId: '',
        setLocalOrderId: vi.fn(),
        localCustomerName: '',
        setLocalCustomerName: vi.fn(),
        localProductName: '',
        setLocalProductName: vi.fn(),
        pageType: 'all' as any
    };

    it('renders all filter fields', () => {
        render(<OrderFiltersForm {...mockProps} />);
        
        expect(screen.getByText('Order ID')).toBeInTheDocument();
        expect(screen.getByText('Customer')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Order id...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Name, Email, ID...')).toBeInTheDocument();
        
        const dropdowns = screen.getAllByTestId('custom-dropdown');
        expect(dropdowns.length).toBeGreaterThan(2); 
    });

    it('triggers setLocalOrderId on input change', () => {
        render(<OrderFiltersForm {...mockProps} />);
        const input = screen.getByPlaceholderText('Order id...');
        fireEvent.change(input, { target: { value: '123' } });
        expect(mockProps.setLocalOrderId).toHaveBeenCalledWith('123');
    });

    it('triggers updateFilter when a dropdown changes', () => {
        render(<OrderFiltersForm {...mockProps} />);
        const dropdown = screen.getAllByTestId('custom-dropdown')[0];
        const select = dropdown.querySelector('select')!;
        fireEvent.change(select, { target: { value: 'test' } });
        expect(mockProps.updateFilter).toHaveBeenCalled();
    });
});
