import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOrders, getOrderById, lookupOrderByDisplayId, createOrder } from '../core';

vi.mock('@/api/apiClient', () => {
    const mockGet = vi.fn();
    const mockPost = vi.fn();
    return {
        apiClient: { get: mockGet, post: mockPost },
        default: { get: mockGet, post: mockPost },
    };
});

import apiClient from '@/api/apiClient';

describe('core orders fetchers', () => {
    beforeEach(() => vi.clearAllMocks());

    it('getOrders calls /orders/order-list on default fetch without active filters', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
            orders: [{ id: '1', order_name: '#1001' }],
            total: 1,
        });

        const result = await getOrders(1, {});
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ url: '/orders/order-list' }),
        );
        expect(result.orders).toHaveLength(1);
        expect(result.total).toBe(1);
    });

    it('getOrders calls /orders/search when active filters exist', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ orders: [], total: 0 });
        await getOrders(1, { search: 'John' });
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ url: '/orders/search' }),
        );
    });

    it('getOrders returns safe fallback on network error', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

        const result = await getOrders(1, {});
        expect(result).toEqual({ orders: [], total: 0 });
        consoleSpy.mockRestore();
    });

    it('getOrderById calls GET /orders/:id', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'ord-123' });
        const result = await getOrderById('ord-123');
        expect(apiClient.get).toHaveBeenCalledWith('/orders/ord-123');
        expect(result).toEqual({ id: 'ord-123' });
    });

    it('lookupOrderByDisplayId returns shopify_order_id on match', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
            orders: [{ id: '1', shopify_order_id: 'shopify-999' }],
            total: 1,
        });

        const result = await lookupOrderByDisplayId('#1001');
        expect(result).toBe('shopify-999');
    });

    it('createOrder calls POST /orders with data', async () => {
        (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'new-order' });
        const result = await createOrder({ status: 'pending' });
        expect(apiClient.post).toHaveBeenCalledWith('/orders', { status: 'pending' });
        expect(result).toEqual({ id: 'new-order' });
    });
});
