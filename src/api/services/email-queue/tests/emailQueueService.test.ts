import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/api/apiClient', () => ({
    default: {
        get: vi.fn(),
    },
}));

import apiClient from '@/api/apiClient';
import { getEmailQueueOverview } from '../emailQueueService';

describe('emailQueueService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns normalized queue overview on success', async () => {
        (apiClient.get as any).mockResolvedValue({
            summary: {
                pending: 3,
                processing: 2,
                completed: 8,
                failed: 1,
                total: 14,
                duePending: 2,
                retryPending: 1,
            },
            jobs: [
                {
                    id: 'job-1',
                    jobKey: 'site:order:first',
                    siteId: 'site-1',
                    orderId: 123,
                    reminderType: 'first',
                    status: 'pending',
                    attempts: 0,
                    availableAt: '2026-04-28T00:00:00.000Z',
                    startedAt: null,
                    processedAt: null,
                    lastError: null,
                    createdAt: '2026-04-28T00:00:00.000Z',
                    updatedAt: '2026-04-28T00:00:00.000Z',
                },
            ],
            generatedAt: '2026-04-28T00:00:00.000Z',
        });

        const result = await getEmailQueueOverview(30);

        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/email/queue/overview',
                params: { limit: 30 },
            }),
        );
        expect(result.summary.total).toBe(14);
        expect(result.jobs).toHaveLength(1);
        expect(result.jobs[0].jobKey).toBe('site:order:first');
    });

    it('returns empty fallback when API fails', async () => {
        (apiClient.get as any).mockRejectedValue(new Error('Network error'));

        const result = await getEmailQueueOverview();

        expect(result.summary.total).toBe(0);
        expect(result.jobs).toEqual([]);
    });
});
