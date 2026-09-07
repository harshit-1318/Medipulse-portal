import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getSurveyVersions,
    getSurveyVersion,
    rollbackSurvey,
    updateSurveySettings,
} from './surveyVersionService';

vi.mock('@/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
    },
}));

import { apiClient } from '@/api/apiClient';

describe('surveyVersionService', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls GET /surveys/:id/versions', async () => {
        (apiClient.get as any).mockResolvedValue({ items: [], total: 0 });
        await getSurveyVersions('abc');
        expect(apiClient.get).toHaveBeenCalledWith('/surveys/abc/versions');
    });

    it('calls GET /surveys/:id/versions/:v', async () => {
        (apiClient.get as any).mockResolvedValue({ versionNumber: 2, schema: {} });
        await getSurveyVersion('abc', 2);
        expect(apiClient.get).toHaveBeenCalledWith('/surveys/abc/versions/2');
    });

    it('calls POST /surveys/:id/rollback/:v with publishImmediately false by default', async () => {
        (apiClient.post as any).mockResolvedValue({ _id: 'abc' });
        await rollbackSurvey('abc', 2);
        expect(apiClient.post).toHaveBeenCalledWith('/surveys/abc/rollback/2', {
            publishImmediately: false,
        });
    });

    it('passes publishImmediately: true when specified', async () => {
        (apiClient.post as any).mockResolvedValue({ _id: 'abc' });
        await rollbackSurvey('abc', 1, true);
        expect(apiClient.post).toHaveBeenCalledWith('/surveys/abc/rollback/1', {
            publishImmediately: true,
        });
    });

    it('calls PUT /surveys/:id/settings', async () => {
        (apiClient.put as any).mockResolvedValue({ _id: 'abc' });
        const settings = { expiryDays: 14, captchaEnabled: true };
        await updateSurveySettings('abc', settings);
        expect(apiClient.put).toHaveBeenCalledWith('/surveys/abc/settings', settings);
    });
});
