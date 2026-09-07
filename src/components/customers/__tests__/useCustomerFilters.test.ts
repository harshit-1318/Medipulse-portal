import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCustomerFilters } from '../hooks';

describe('useCustomerFilters', () => {
    it('initializes with filter values and allows local state updates', () => {
        const mockSetFilters = vi.fn();
        const mockSetPage = vi.fn();
        const mockSetFiltersEnabled = vi.fn();

        const initialFilters = { search: 'John', totalPens: '5', customer_start_date: '2026-01-01' };

        const { result } = renderHook(() =>
            useCustomerFilters(initialFilters, mockSetFilters, mockSetPage, mockSetFiltersEnabled)
        );

        expect(result.current.localSearch).toBe('John');
        expect(result.current.localTotalPens).toBe('5');
        expect(result.current.localStartDate).toBe('2026-01-01');

        act(() => {
            result.current.setLocalSearch('Alice');
        });

        expect(result.current.localSearch).toBe('Alice');
    });

    it('updates filters and closes modal on handleApply', () => {
        const mockSetFilters = vi.fn();
        const mockSetPage = vi.fn();
        const mockSetFiltersEnabled = vi.fn();

        const { result } = renderHook(() =>
            useCustomerFilters({}, mockSetFilters, mockSetPage, mockSetFiltersEnabled)
        );

        act(() => {
            result.current.setLocalSearch('Test User');
            result.current.handleApply();
        });

        expect(mockSetPage).toHaveBeenCalledWith(1);
        expect(mockSetFiltersEnabled).toHaveBeenCalledWith(false);
        expect(mockSetFilters).toHaveBeenCalled();
    });

    it('clears all filters on handleClear', () => {
        const mockSetFilters = vi.fn();
        const mockSetPage = vi.fn();
        const mockSetFiltersEnabled = vi.fn();

        const { result } = renderHook(() =>
            useCustomerFilters({ search: 'Foo' }, mockSetFilters, mockSetPage, mockSetFiltersEnabled)
        );

        act(() => {
            result.current.clearFilters();
        });

        expect(mockSetPage).toHaveBeenCalledWith(1);
        expect(result.current.localSearch).toBe('');
        expect(mockSetFilters).toHaveBeenCalledWith(expect.objectContaining({ search: '', totalPens: '' }));
    });
});
