import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getLeads,
    getLeadStats,
    getLead,
    getLeadNotes,
    getLeadActivity,
} from './leadService';

const { mockGet } = vi.hoisted(() => ({
    mockGet: vi.fn(),
}));

vi.mock('@/api/apiClient', () => ({
    apiClient: {
        get: mockGet,
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('leadService Queries', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('getLeads', () => {
        it('calls GET /leads with default page and limit', async () => {
            mockGet.mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });
            await getLeads();
            expect(mockGet).toHaveBeenCalledWith('/leads', {
                params: { page: 1, limit: 20 },
            });
        });

        it('passes through provided filter params', async () => {
            mockGet.mockResolvedValue({ data: [], total: 0, page: 2, limit: 10 });
            await getLeads({ page: 2, limit: 10, status: 'new', search: 'Alice' });
            expect(mockGet).toHaveBeenCalledWith('/leads', {
                params: { page: 2, limit: 10, status: 'new', search: 'Alice' },
            });
        });

        it('omits empty-string filter values', async () => {
            mockGet.mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });
            await getLeads({ page: 1, limit: 20, search: '' });
            const { params } = (mockGet.mock.calls[0] as any)[1];
            expect(params).not.toHaveProperty('search');
        });

        it('omits undefined filter values', async () => {
            mockGet.mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });
            await getLeads({ page: 1, limit: 20, status: undefined });
            const { params } = (mockGet.mock.calls[0] as any)[1];
            expect(params).not.toHaveProperty('status');
        });

        it('returns the resolved value', async () => {
            const response = { data: [{ id: 'l1' }], total: 1, page: 1, limit: 20 };
            mockGet.mockResolvedValue(response);
            const result = await getLeads();
            expect(result).toEqual(response);
        });
    });

    describe('getLeadStats, getLead, getLeadNotes, getLeadActivity', () => {
        it('calls GET /leads/stats', async () => {
            mockGet.mockResolvedValue({ total: 10, new: 3 });
            await getLeadStats();
            expect(mockGet).toHaveBeenCalledWith('/leads/stats');
        });

        it('calls GET /leads/:id', async () => {
            mockGet.mockResolvedValue({ id: 'l99' });
            await getLead('l99');
            expect(mockGet).toHaveBeenCalledWith('/leads/l99');
        });

        it('calls GET /leads/:id/notes', async () => {
            mockGet.mockResolvedValue({ data: [], total: 0 });
            await getLeadNotes('l1');
            expect(mockGet).toHaveBeenCalledWith('/leads/l1/notes');
        });

        it('calls GET /leads/:id/activity', async () => {
            mockGet.mockResolvedValue({ data: [], total: 0 });
            await getLeadActivity('l1');
            expect(mockGet).toHaveBeenCalledWith('/leads/l1/activity');
        });
    });
});
