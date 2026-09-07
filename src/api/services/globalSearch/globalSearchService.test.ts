import { describe, it, expect, vi, beforeEach } from 'vitest';
import { globalSearch } from './globalSearchService';

vi.mock('@/api/apiClient', () => ({
    apiClient: { get: vi.fn() },
}));

import { apiClient } from '@/api/apiClient';

describe('globalSearch', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls GET /global-search with the trimmed query', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
            orders: [],
            customers: [],
        });

        const result = await globalSearch('13052652519804');

        expect(apiClient.get).toHaveBeenCalledWith('/global-search', {
            params: { q: '13052652519804' },
        });
        expect(result).toEqual({ orders: [], customers: [] });
    });

    it('trims whitespace before sending', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
            orders: [],
            customers: [],
        });

        await globalSearch('  jane@example.com  ');

        expect(apiClient.get).toHaveBeenCalledWith('/global-search', {
            params: { q: 'jane@example.com' },
        });
    });

    it('returns empty result without making a request when query is shorter than 2 chars', async () => {
        const result = await globalSearch('x');

        expect(apiClient.get).not.toHaveBeenCalled();
        expect(result).toEqual({ orders: [], customers: [] });
    });

    it('returns empty result without making a request for empty string', async () => {
        const result = await globalSearch('');

        expect(apiClient.get).not.toHaveBeenCalled();
        expect(result).toEqual({ orders: [], customers: [] });
    });

    it('returns empty result on API error without throwing', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error('Network error'),
        );

        const result = await globalSearch('patient@example.com');

        expect(result).toEqual({ orders: [], customers: [] });
    });

    it('returns the response data from a successful search', async () => {
        const mockResponse = {
            orders: [
                {
                    shopify_order_id: 13052652519804,
                    order_name: '#1001',
                    email: 'jane@example.com',
                    customerName: 'Jane Doe',
                    status: 'open',
                    createdAt: '2026-01-01T00:00:00.000Z',
                    matchType: 'exact',
                },
            ],
            customers: [],
        };
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

        const result = await globalSearch('13052652519804');

        expect(result.orders).toHaveLength(1);
        expect(result.orders[0].matchType).toBe('exact');
        expect(result.customers).toHaveLength(0);
    });
});
