import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserActivitySummary } from '../service';

vi.mock('@/api/apiClient', () => ({
    default: { get: vi.fn() },
}));

import apiClient from '@/api/apiClient';

describe('getUserActivitySummary', () => {
    beforeEach(() => vi.clearAllMocks());

    it('maps uniqueOrdersViewed from API response', async () => {
        (apiClient.get as any).mockResolvedValue({
            userEmail: 'admin@test.com',
            uniqueOrdersViewed: 7,
            summary: [],
            estimationModel: {
                sessionGapMinutes: 30,
                minimumSessionMinutes: 5,
                dayBoundaryTimezone: 'UTC',
                excludedActionsFromActiveHours: ['login_success', 'login_failed'],
            },
        });

        const result = await getUserActivitySummary('admin@test.com', '2026-04-01', '2026-04-30');

        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/activity-log/user-summary',
                method: 'GET',
                params: expect.objectContaining({
                    userEmail: 'admin@test.com',
                    startDate: '2026-04-01',
                    endDate: '2026-04-30',
                }),
            }),
        );
        expect(result.uniqueOrdersViewed).toBe(7);
    });

    it('returns safe defaults on API error', async () => {
        (apiClient.get as any).mockRejectedValue(new Error('Network error'));
        const result = await getUserActivitySummary('admin@test.com');

        expect(result).toMatchObject({
            userEmail: 'admin@test.com',
            uniqueOrdersViewed: 0,
            summary: [],
            estimationModel: {
                sessionGapMinutes: 30,
                minimumSessionMinutes: 5,
                dayBoundaryTimezone: 'UTC',
                excludedActionsFromActiveHours: ['login_success', 'login_failed'],
            },
        });
    });
});
