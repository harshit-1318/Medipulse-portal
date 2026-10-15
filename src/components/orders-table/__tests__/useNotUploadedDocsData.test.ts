import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotUploadedDocsData } from "../hooks";
import { getOrders } from '@/api/services/orders';
import { useGlobalLoader } from '@/store';

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
    getDashboardStorageKey: vi.fn(() => 'not-uploaded-docs-test-key'),
}));

describe('useNotUploadedDocsData', () => {
    const mockStart = vi.fn();
    const mockStop = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useGlobalLoader).mockReturnValue({
            start: mockStart,
            stop: mockStop,
        } as any);

        vi.mocked(getOrders).mockResolvedValue({
            orders: [
                {
                    id: '#MP-89216',
                    shopify_order_id: '589216',
                    customerName: 'Harper Garcia',
                    date: '2026-10-15T15:59:02.000Z',
                    documents: 'Not Uploaded',
                    documentItemsStatus: { id: false, fullPhoto: false, video: false },
                },
            ],
            total: 1,
        } as any);
    });

    it('initializes with sort: "desc" and sortBy: "date" matching All Orders', async () => {
        const { result } = renderHook(() => useNotUploadedDocsData());

        expect(result.current.loading).toBe(true);
        expect(result.current.page).toBe(1);
        expect(result.current.filters.documents).toBe('Not Uploaded');
        expect(result.current.filters.sort).toBe('desc');
        expect(result.current.filters.sortBy).toBe('date');

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.orders).toHaveLength(1);
        expect(result.current.total).toBe(1);
        expect(getOrders).toHaveBeenCalledWith(1, expect.objectContaining({
            documents: 'Not Uploaded',
            sort: 'desc',
            sortBy: 'date',
        }));
        expect(mockStart).toHaveBeenCalledWith('not-uploaded-docs-orders');
        expect(mockStop).toHaveBeenCalledWith('not-uploaded-docs-orders');
    });

    it('updates orders when page changes', async () => {
        const { result } = renderHook(() => useNotUploadedDocsData());
        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.setPage(2);
        });

        expect(result.current.loading).toBe(true);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(getOrders).toHaveBeenCalledTimes(2);
        expect(getOrders).toHaveBeenLastCalledWith(2, expect.objectContaining({
            documents: 'Not Uploaded',
            sort: 'desc',
        }));
    });

    it('handles API errors gracefully', async () => {
        vi.mocked(getOrders).mockRejectedValueOnce(new Error('API Failure'));
        const { result } = renderHook(() => useNotUploadedDocsData());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.orders).toHaveLength(0);
        expect(mockStop).toHaveBeenCalledWith('not-uploaded-docs-orders');
    });
});
