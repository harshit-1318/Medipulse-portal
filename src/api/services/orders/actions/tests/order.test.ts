import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    resyncOrder,
    resyncOrderFromShopify,
    updateScrReview,
    markOrderUrgent,
    cancelOrder,
    markOrderOnHold,
} from '../order';

vi.mock('@/api/apiClient', () => {
    const mockPost = vi.fn();
    const mockRequest = vi.fn();
    return {
        apiClient: { post: mockPost, get: vi.fn(), request: mockRequest },
        default: { post: mockPost, get: vi.fn(), request: mockRequest },
    };
});

import apiClient from '@/api/apiClient';

describe('order actions', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('resyncOrder', () => {
        it('calls POST /orders/:id/resync with the given orderId', async () => {
            (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
                message: 'Order re-synced successfully from store',
            });

            const result = await resyncOrder('order-mongo-id-123');
            expect(apiClient.post).toHaveBeenCalledWith('/orders/order-mongo-id-123/resync', {});
            expect(result).toEqual({ message: 'Order re-synced successfully from store' });
        });

        it('works via resyncOrderFromShopify alias', async () => {
            (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
                message: 'Order re-synced successfully from store',
            });

            const result = await resyncOrderFromShopify('order-mongo-id-123');
            expect(apiClient.post).toHaveBeenCalledWith('/orders/order-mongo-id-123/resync', {});
            expect(result).toEqual({ message: 'Order re-synced successfully from store' });
        });

        it('throws an Error with the backend message when request fails', async () => {
            (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue({
                response: { data: { message: 'Order not found' } },
            });

            await expect(resyncOrder('bad-id')).rejects.toThrow('Order not found');
        });

        it('throws a generic error message when no backend message is available', async () => {
            (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network Error'));
            await expect(resyncOrder('some-id')).rejects.toThrow('Failed to re-sync order from store');
        });
    });

    describe('status and workflow actions', () => {
        it('updateScrReview calls POST /orders/update-status', async () => {
            (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
            const result = await updateScrReview({ order_id: 'ord-1', status: 'approved' });
            expect(apiClient.post).toHaveBeenCalledWith('/orders/update-status', {
                order_id: 'ord-1',
                status: 'approved',
            });
            expect(result).toEqual({ success: true });
        });

        it('markOrderUrgent calls POST /orders/make-urgent/:id with cleaned id', async () => {
            (apiClient.request as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
            await markOrderUrgent('#1001/');
            expect(apiClient.request).toHaveBeenCalledWith({ url: '/orders/make-urgent/1001', method: 'POST' });
        });

        it('markOrderUrgent throws on invalid id', async () => {
            await expect(markOrderUrgent('')).rejects.toThrow('Invalid Shopify Order ID');
            await expect(markOrderUrgent('--')).rejects.toThrow('Invalid Shopify Order ID');
        });

        it('cancelOrder calls POST /orders/cancel', async () => {
            (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
            const result = await cancelOrder({ orderId: 'ord-2' } as any);
            expect(apiClient.post).toHaveBeenCalledWith('/orders/cancel', { orderId: 'ord-2' });
            expect(result).toEqual({ success: true });
        });

        it('markOrderOnHold calls POST /orders/update-status with mark_on_hold=1', async () => {
            (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
            const result = await markOrderOnHold('ord-3');
            expect(apiClient.post).toHaveBeenCalledWith('/orders/update-status', {
                order_id: 'ord-3',
                mark_on_hold: '1',
            });
            expect(result).toEqual({ success: true });
        });
    });
});
