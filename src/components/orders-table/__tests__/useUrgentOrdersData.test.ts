import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUrgentOrdersData } from "../hooks";
import { getOrders } from '@/api/services/orders';
import { useGlobalLoader } from '@/store';

// Mock dependencies
vi.mock('@/api/services/orders', () => ({
    getOrders: vi.fn(),
}));

vi.mock('@/store', () => ({
    useGlobalLoader: vi.fn(),
}));

vi.mock('@/hooks', () => ({
    useUrlSync: vi.fn(),
}));

vi.mock('@/utils/url', () => ({
    getInitialOrderFilters: vi.fn((def) => def),
    getUrlParamInt: vi.fn((_, def) => def),
    getDashboardStorageKey: vi.fn(() => 'test-key'),
}));

describe('useUrgentOrdersData', () => {
    const mockStart = vi.fn();
    const mockStop = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useGlobalLoader).mockReturnValue({
            start: mockStart,
            stop: mockStop,
        } as any);
        
        vi.mocked(getOrders).mockResolvedValue({
            orders: [{ id: '1', shopifyOrderId: 101, status: 'urgent' }],
            total: 1
        } as any);
    });

    it('initializes with default values and fetches orders', async () => {
        const { result } = renderHook(() => useUrgentOrdersData());

        // Check initial state
        expect(result.current.loading).toBe(true);
        expect(result.current.page).toBe(1);
        expect(result.current.filters.isUrgent).toBe(true);

        // Wait for data fetching
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.orders).toHaveLength(1);
        expect(result.current.total).toBe(1);
        expect(getOrders).toHaveBeenCalled();
        expect(mockStart).toHaveBeenCalledWith('urgent-orders');
        expect(mockStop).toHaveBeenCalledWith('urgent-orders');
    });

    it('updates orders when page changes', async () => {
        const { result } = renderHook(() => useUrgentOrdersData());

        await waitFor(() => expect(result.current.loading).toBe(false));
        
        act(() => {
            result.current.setPage(2);
        });

        expect(result.current.loading).toBe(true);
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(getOrders).toHaveBeenCalledTimes(2);
        expect(getOrders).toHaveBeenLastCalledWith(2, expect.any(Object));
    });

    it('handles API errors gracefully', async () => {
        vi.mocked(getOrders).mockRejectedValueOnce(new Error('API Error'));

        const { result } = renderHook(() => useUrgentOrdersData());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.orders).toHaveLength(0);
        expect(mockStop).toHaveBeenCalledWith('urgent-orders');
    });
});
