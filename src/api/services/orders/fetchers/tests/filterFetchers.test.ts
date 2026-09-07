import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSingleOrderCustomers, getRepeatCustomers } from '../customer';
import { getUploadedOrders, getNotUploadedOrders } from '../document';
import { getOnHoldOrders, getUnfulfilledOrders, getFulfilledOrders } from '../status';

vi.mock('@/api/apiClient', () => {
    const mockGet = vi.fn();
    return {
        apiClient: { get: mockGet },
        default: { get: mockGet },
    };
});

import apiClient from '@/api/apiClient';

describe('specialized filter fetchers', () => {
    beforeEach(() => vi.clearAllMocks());

    it('getSingleOrderCustomers calls /orders/search with order_type=first', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ orders: [{ id: 'c1' }], total: 1 });
        const result = await getSingleOrderCustomers(1, 10);
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ url: '/orders/search', params: expect.objectContaining({ order_type: 'first' }) }),
        );
        expect(result.orders).toHaveLength(1);
    });

    it('getRepeatCustomers calls /orders/search with order_type=repeat', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ orders: [{ id: 'c2' }], total: 1 });
        const result = await getRepeatCustomers(1, 10);
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ url: '/orders/search', params: expect.objectContaining({ order_type: 'repeat' }) }),
        );
        expect(result.orders).toHaveLength(1);
    });

    it('getUploadedOrders calls /orders/search with documentStatus=uploaded', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ orders: [], total: 0 });
        await getUploadedOrders(1, 20);
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ params: expect.objectContaining({ documentStatus: 'uploaded' }) }),
        );
    });

    it('getNotUploadedOrders calls /orders/search with documentStatus=not-uploaded', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ orders: [], total: 0 });
        await getNotUploadedOrders(1, 20);
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ params: expect.objectContaining({ documentStatus: 'not-uploaded' }) }),
        );
    });

    it('getOnHoldOrders calls /orders/search with orderStatus=on_hold', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ orders: [], total: 0 });
        await getOnHoldOrders(1, 20);
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ params: expect.objectContaining({ orderStatus: 'on_hold' }) }),
        );
    });

    it('getUnfulfilledOrders calls /orders/search with orderStatus=unfulfilled', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ orders: [], total: 0 });
        await getUnfulfilledOrders(1, 20);
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ params: expect.objectContaining({ orderStatus: 'unfulfilled' }) }),
        );
    });

    it('getFulfilledOrders calls /orders/search with orderStatus=fulfilled', async () => {
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ orders: [], total: 0 });
        await getFulfilledOrders(1, 20);
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ params: expect.objectContaining({ orderStatus: 'fulfilled' }) }),
        );
    });
});
