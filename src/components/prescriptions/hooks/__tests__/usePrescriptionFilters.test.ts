import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePrescriptionFilters } from '../usePrescriptionFilters';

describe('usePrescriptionFilters Hook', () => {
  it('initializes with filter state and provides active chips', () => {
    const filters = {
      orderId: 'MP-10797',
      prescriber: 'Dr. Sarah Jenkins',
      customerId: '657339',
      startDate: '2026-09-09',
      reviewStartDate: '2026-09-10',
    };
    const setFilters = vi.fn();
    const setPage = vi.fn();

    const { result } = renderHook(() => usePrescriptionFilters(filters, setFilters, setPage));

    expect(result.current.localOrderId).toBe('MP-10797');
    expect(result.current.localPrescriber).toBe('Dr. Sarah Jenkins');
    expect(result.current.localCustomerId).toBe('657339');
    expect(result.current.activeFilterChips).toHaveLength(5);
  });

  it('applyFilters immediately flushes local text state to filters and resets page to 1', () => {
    const filters = { orderId: '', prescriber: '', customerId: '' };
    const setFilters = vi.fn();
    const setPage = vi.fn();

    const { result } = renderHook(() => usePrescriptionFilters(filters, setFilters, setPage));

    act(() => {
      result.current.setLocalOrderId('  MP-99881  ');
      result.current.setLocalPrescriber('  Dr. Jenkins  ');
      result.current.setLocalCustomerId('  554433  ');
    });

    act(() => {
      result.current.applyFilters();
    });

    expect(setPage).toHaveBeenCalledWith(1);
    expect(setFilters).toHaveBeenCalled();
    const updater = setFilters.mock.calls[0][0];
    const updated = typeof updater === 'function' ? updater(filters) : updater;
    expect(updated).toEqual(
      expect.objectContaining({
        orderId: 'MP-99881',
        prescriber: 'Dr. Jenkins',
        customerId: '554433',
      })
    );
  });

  it('clearFilters resets all inputs and filter state', () => {
    const filters = {
      orderId: 'MP-1001',
      prescriber: 'Sarah',
      customerId: '123',
      startDate: '2026-09-09',
      reviewStartDate: '2026-09-10',
    };
    const setFilters = vi.fn();
    const setPage = vi.fn();

    const { result } = renderHook(() => usePrescriptionFilters(filters, setFilters, setPage));

    act(() => {
      result.current.clearFilters();
    });

    expect(setPage).toHaveBeenCalledWith(1);
    expect(result.current.localOrderId).toBe('');
    expect(result.current.localPrescriber).toBe('');
    expect(result.current.localCustomerId).toBe('');
    const updater = setFilters.mock.calls[0][0];
    const updated = typeof updater === 'function' ? updater(filters) : updater;
    expect(updated).toEqual({
      orderId: '',
      prescriber: '',
      customerId: '',
      startDate: '',
      reviewStartDate: '',
    });
  });

  it('removeFilter clears the target filter chip and resets its local value', () => {
    const filters = { orderId: 'MP-1001' };
    const setFilters = vi.fn();
    const setPage = vi.fn();

    const { result } = renderHook(() => usePrescriptionFilters(filters, setFilters, setPage));

    act(() => {
      result.current.removeFilter('orderId');
    });

    expect(result.current.localOrderId).toBe('');
    expect(setPage).toHaveBeenCalledWith(1);
  });
});
