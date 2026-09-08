import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboardStats } from '../dashboardService';

const { mockApiClient } = vi.hoisted(() => {
    return {
        mockApiClient: {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        },
    };
});

vi.mock('@/api/apiClient', () => ({
    default: mockApiClient,
    apiClient: mockApiClient,
}));

describe('dashboardService', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('getDashboardStats', () => {
        it('calls GET /orders/dashboard-stats and returns stats data', async () => {
            const mockStats = {
                totalOrders: 10,
                onHoldOrders: 2,
                prescriptionsUploaded: 5,
                urgentOrders: 1,
            };
            mockApiClient.get.mockResolvedValue(mockStats);

            const result = await getDashboardStats();

            expect(mockApiClient.get).toHaveBeenCalledWith('/orders/dashboard-stats');
            expect(result).toEqual(mockStats);
        });
    });
});
