import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSurveySession, saveProgress } from './publicSurveyService';

const { mockGet, mockPatch } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPatch: vi.fn(),
}));

vi.mock('axios', async () => {
    const actual = await vi.importActual<typeof import('axios')>('axios');
    return {
        ...actual,
        default: {
            ...actual.default,
            create: vi.fn(() => ({
                get: mockGet,
                patch: mockPatch,
                post: vi.fn(),
                interceptors: {
                    request: { use: vi.fn() },
                    response: { use: vi.fn() },
                },
            })),
        },
    };
});

describe('publicSurveyService Session & Progress', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('getSurveySession', () => {
        it('calls GET /surveys/s/:token with X-Survey-Token header', async () => {
            const payload = { sessionId: 's1', status: 'in_progress', schema: {} };
            mockGet.mockResolvedValue(payload);
            await getSurveySession('tok123');
            expect(mockGet).toHaveBeenCalledWith(
                '/surveys/s/tok123',
                expect.objectContaining({
                    headers: { 'X-Survey-Token': 'tok123' },
                })
            );
        });

        it('returns resolved data and propagates errors', async () => {
            const payload = { sessionId: 's1', status: 'in_progress', surveyTitle: 'Test' };
            mockGet.mockResolvedValue(payload);
            const result = await getSurveySession('tok123');
            expect(result).toEqual(payload);

            const error = Object.assign(new Error('Gone'), { response: { status: 410, data: { expired: true } } });
            mockGet.mockRejectedValue(error);
            await expect(getSurveySession('bad-token')).rejects.toMatchObject({ response: { status: 410 } });
        });
    });

    describe('saveProgress', () => {
        it('calls PATCH /surveys/s/:token/progress with payload & header', async () => {
            mockPatch.mockResolvedValue({ saved: true, savedAt: '2026-04-14T10:00:00Z' });
            await saveProgress('tok123', { partialResponse: { q1: 'a' }, currentPage: 1 });
            expect(mockPatch).toHaveBeenCalledWith(
                '/surveys/s/tok123/progress',
                { partialResponse: { q1: 'a' }, currentPage: 1 },
                expect.objectContaining({ headers: { 'X-Survey-Token': 'tok123' } })
            );
        });
    });
});
