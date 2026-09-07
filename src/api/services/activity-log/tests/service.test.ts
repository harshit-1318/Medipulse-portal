import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getActivityLogs } from '../service';

vi.mock('@/api/apiClient', () => ({
    default: { get: vi.fn() },
}));

import apiClient from '@/api/apiClient';

describe('getActivityLogs', () => {
    beforeEach(() => vi.clearAllMocks());

    it('always calls /activity-log/list/filters (not /list)', async () => {
        (apiClient.get as any).mockResolvedValue({ logs: [], total: 0 });
        await getActivityLogs(1, 20, {});
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({ url: '/activity-log/list/filters' }),
        );
    });

    it('always calls /activity-log/list/filters even with no filters', async () => {
        (apiClient.get as any).mockResolvedValue({ logs: [], total: 0 });
        await getActivityLogs(1, 20, {});
        const callArg = (apiClient.get as any).mock.calls[0][0];
        expect(callArg.url).toBe('/activity-log/list/filters');
    });

    it('maps response logs through mapToActivityLog and returns count field', async () => {
        (apiClient.get as any).mockResolvedValue({
            logs: [
                {
                    _id: 'log1',
                    action_type: 'order_viewed',
                    view: 'orders',
                    user_email: 'x@y.com',
                    object_guid: '42',
                    createdAt: '2026-04-23T10:00:00Z',
                    count: 5,
                },
            ],
            total: 1,
        });

        const result = await getActivityLogs(1, 20, {});
        expect(result.total).toBe(1);
        expect(result.activityLogs[0].count).toBe(5);
        expect(result.activityLogs[0].orderId).toBe('42');
    });

    it('returns empty list on API error', async () => {
        (apiClient.get as any).mockRejectedValue(new Error('Network error'));
        const result = await getActivityLogs(1, 20, {});
        expect(result.activityLogs).toEqual([]);
        expect(result.total).toBe(0);
    });

    it('uses total from response, not list length', async () => {
        (apiClient.get as any).mockResolvedValue({ logs: [], total: 99 });
        const result = await getActivityLogs(1, 20, {});
        expect(result.total).toBe(99);
    });
});
