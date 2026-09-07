import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActiveFilterChips } from "../filters";

describe('ActiveFilterChips', () => {
    const mockFilters = [
        { key: 'status', label: 'Status', value: 'Pending' },
        { key: 'customer', label: 'Customer', value: 'John Doe' }
    ];

    const mockProps = {
        activeFilters: mockFilters,
        removeFilter: vi.fn(),
        clearFilters: vi.fn()
    };

    it('renders all active filters as chips', () => {
        render(<ActiveFilterChips {...mockProps} />);
        expect(screen.getByText(/Status:/i)).toBeInTheDocument();
        expect(screen.getByText(/Pending/i)).toBeInTheDocument();
        expect(screen.getByText(/Customer:/i)).toBeInTheDocument();
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('calls removeFilter when X button is clicked', () => {
        render(<ActiveFilterChips {...mockProps} />);
        const removeButtons = screen.getAllByRole('button').filter(b => b.textContent !== 'Clear All Filters');
        fireEvent.click(removeButtons[0]);
        expect(mockProps.removeFilter).toHaveBeenCalledWith('status');
    });

    it('calls clearFilters when Clear All is clicked', () => {
        render(<ActiveFilterChips {...mockProps} />);
        fireEvent.click(screen.getByText('Clear All'));
        expect(mockProps.clearFilters).toHaveBeenCalled();
    });

    it('renders nothing when activeFilters is empty', () => {
        const { container } = render(<ActiveFilterChips {...mockProps} activeFilters={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
