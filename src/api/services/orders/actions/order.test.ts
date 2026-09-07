import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resyncOrderFromShopify } from './order';

// Mock apiClient — order.ts uses the default import; mock both to cover either
vi.mock('@/api/apiClient', () => {
    const mockPost = vi.fn();
    return {
        apiClient: { post: mockPost, get: vi.fn(), request: vi.fn() },
        default: { post: mockPost, get: vi.fn(), request: vi.fn() },
    };
});

// Import after mock so vi.mock hoisting resolves correctly
import apiClient from '@/api/apiClient';

describe('resyncOrderFromShopify', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls POST /orders/:id/resync-shopify with the given orderId', async () => {
        (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
            message: 'Order re-synced successfully from Shopify',
        });

        const result = await resyncOrderFromShopify('order-mongo-id-123');

        expect(apiClient.post).toHaveBeenCalledWith(
            '/orders/order-mongo-id-123/resync-shopify',
            {},
        );
        expect(result).toEqual({
            message: 'Order re-synced successfully from Shopify',
        });
    });

    it('throws an Error with the backend message when the request fails', async () => {
        (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue({
            response: { data: { message: 'Order not found' } },
        });

        await expect(resyncOrderFromShopify('bad-id')).rejects.toThrow(
            'Order not found',
        );
    });

    it('throws a generic error message when no backend message is available', async () => {
        (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error('Network Error'),
        );

        await expect(resyncOrderFromShopify('some-id')).rejects.toThrow(
            'Failed to re-sync order from Shopify',
        );
    });
});
