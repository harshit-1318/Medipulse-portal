import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getSurveys,
    getSurveyStats,
    getSurvey,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    publishSurvey,
    unpublishSurvey,
    duplicateSurvey,
} from './surveyService';

vi.mock('@/api/apiClient', () => ({
    apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { apiClient } from '@/api/apiClient';

describe('surveyService CRUD & Lifecycle', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('getSurveys', () => {
        it('calls GET /surveys with default params', async () => {
            (apiClient.get as any).mockResolvedValue({ items: [], total: 0 });
            await getSurveys();
            expect(apiClient.get).toHaveBeenCalledWith('/surveys', {
                params: expect.objectContaining({ page: 1, limit: 20, sortBy: 'createdAt', sort: 'desc' }),
            });
        });

        it('includes search and status filters when provided', async () => {
            (apiClient.get as any).mockResolvedValue({ items: [], total: 0 });
            await getSurveys({ search: 'intake', status: 'published' });
            expect(apiClient.get).toHaveBeenCalledWith('/surveys', {
                params: expect.objectContaining({ search: 'intake', status: 'published' }),
            });
        });

        it('omits empty search and status', async () => {
            (apiClient.get as any).mockResolvedValue({ items: [], total: 0 });
            await getSurveys({ search: '', status: '' });
            const { params } = (apiClient.get as any).mock.calls[0][1];
            expect(params).not.toHaveProperty('search');
            expect(params).not.toHaveProperty('status');
        });
    });

    describe('getSurveyStats & CRUD', () => {
        it('calls GET /surveys/stats', async () => {
            (apiClient.get as any).mockResolvedValue({ totalSurveys: 5 });
            const result = await getSurveyStats();
            expect(apiClient.get).toHaveBeenCalledWith('/surveys/stats');
            expect(result).toEqual({ totalSurveys: 5 });
        });

        it('handles create, update, delete, publish, unpublish, duplicate', async () => {
            (apiClient.get as any).mockResolvedValue({ _id: 'abc', title: 'Intake' });
            expect((await getSurvey('abc'))._id).toBe('abc');

            const payload = { title: 'New', slug: 'new', status: 'draft' as const };
            (apiClient.post as any).mockResolvedValue({ _id: 'new1', ...payload });
            expect((await createSurvey(payload))._id).toBe('new1');

            (apiClient.put as any).mockResolvedValue({ _id: 'abc', title: 'Updated' });
            await updateSurvey('abc', { title: 'Updated' });
            expect(apiClient.put).toHaveBeenCalledWith('/surveys/abc', { title: 'Updated' });

            (apiClient.delete as any).mockResolvedValue(null);
            await deleteSurvey('abc');
            expect(apiClient.delete).toHaveBeenCalledWith('/surveys/abc');

            (apiClient.post as any).mockResolvedValue({ _id: 'abc', status: 'published' });
            await publishSurvey('abc', 'Changelog');
            await unpublishSurvey('abc');
            await duplicateSurvey('abc', 'Copy');
            expect(apiClient.post).toHaveBeenCalledWith('/surveys/abc/duplicate', { title: 'Copy' });
        });
    });
});
