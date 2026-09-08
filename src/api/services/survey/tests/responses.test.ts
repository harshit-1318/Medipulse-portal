import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    sendSurveyToCustomer,
    getSurveyResponses,
    getSurveyResponse,
    deleteSurveyResponse,
    getAllSurveyResponses,
} from '../surveyResponsesService';

vi.mock('@/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

import { apiClient } from '@/api/apiClient';

describe('surveyResponsesService', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls POST /surveys/:id/send with customerId', async () => {
        const mockResponse = { sessionId: 's1', token: 'tok123', surveyLink: '/s/tok123' };
        (apiClient.post as any).mockResolvedValue(mockResponse);
        const result = await sendSurveyToCustomer('abc', { customerId: 'cust1' });
        expect(apiClient.post).toHaveBeenCalledWith('/surveys/abc/send', { customerId: 'cust1' });
        expect(result.token).toBe('tok123');
    });

    it('includes orderId when provided', async () => {
        (apiClient.post as any).mockResolvedValue({ sessionId: 's1' });
        await sendSurveyToCustomer('abc', { customerId: 'cust1', orderId: 'ord1' });
        expect(apiClient.post).toHaveBeenCalledWith('/surveys/abc/send', {
            customerId: 'cust1',
            orderId: 'ord1',
        });
    });

    it('calls GET /surveys/:id/responses with params', async () => {
        (apiClient.get as any).mockResolvedValue({ items: [], total: 0 });
        await getSurveyResponses('abc', { page: 2, limit: 10 });
        expect(apiClient.get).toHaveBeenCalledWith('/surveys/abc/responses', {
            params: { page: 2, limit: 10 },
        });
    });

    it('calls GET /surveys/:id/responses/:sessionId', async () => {
        (apiClient.get as any).mockResolvedValue({ _id: 'sess1' });
        await getSurveyResponse('abc', 'sess1');
        expect(apiClient.get).toHaveBeenCalledWith('/surveys/abc/responses/sess1');
    });

    it('calls DELETE /surveys/:id/responses/:sessionId', async () => {
        (apiClient.delete as any).mockResolvedValue(null);
        await deleteSurveyResponse('abc', 'sess1');
        expect(apiClient.delete).toHaveBeenCalledWith('/surveys/abc/responses/sess1');
    });

    it('calls GET /surveys/responses', async () => {
        (apiClient.get as any).mockResolvedValue({ items: [], total: 0 });
        await getAllSurveyResponses();
        expect(apiClient.get).toHaveBeenCalledWith('/surveys/responses', { params: {} });
    });
});
