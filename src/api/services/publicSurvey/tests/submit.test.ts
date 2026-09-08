import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitSurvey } from '../publicSurveyService';

const { mockPost } = vi.hoisted(() => ({
    mockPost: vi.fn(),
}));

vi.mock('axios', async () => {
    const actual = await vi.importActual<typeof import('axios')>('axios');
    return {
        ...actual,
        default: {
            ...actual.default,
            create: vi.fn(() => ({
                get: vi.fn(),
                patch: vi.fn(),
                post: mockPost,
                interceptors: {
                    request: { use: vi.fn() },
                    response: { use: vi.fn() },
                },
            })),
        },
    };
});

describe('publicSurveyService Submit', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('submitSurvey', () => {
        it('calls POST /surveys/s/:token/submit with response data', async () => {
            const mockResult = { submitted: true, submittedAt: '2026-04-14T12:00:00Z', message: 'Thank you!' };
            mockPost.mockResolvedValue(mockResult);
            await submitSurvey('tok123', {
                submittedResponse: { q1: 'yes', q2: 'no' },
                metadata: { userAgent: 'Mozilla/5.0', submittedFrom: 'https://example.com/s/tok123' },
            });
            expect(mockPost).toHaveBeenCalledWith(
                '/surveys/s/tok123/submit',
                expect.objectContaining({
                    submittedResponse: { q1: 'yes', q2: 'no' },
                }),
                expect.objectContaining({ headers: { 'X-Survey-Token': 'tok123' } })
            );
        });

        it('propagates 410 rejection when already submitted', async () => {
            const error = Object.assign(new Error('Gone'), {
                response: { status: 410, data: { alreadySubmitted: true } },
            });
            mockPost.mockRejectedValue(error);
            await expect(
                submitSurvey('tok123', { submittedResponse: {} })
            ).rejects.toMatchObject({ response: { status: 410 } });
        });

        it('works without optional metadata', async () => {
            mockPost.mockResolvedValue({ submitted: true });
            await submitSurvey('tok123', { submittedResponse: { q1: 'a' } });
            const [, body] = mockPost.mock.calls[0];
            expect(body).not.toHaveProperty('metadata');
        });
    });
});
