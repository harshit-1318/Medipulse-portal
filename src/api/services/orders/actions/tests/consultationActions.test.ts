import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendAgeVerification } from '../consultationActions';

vi.mock('@/api/apiClient', () => ({
    apiClient: { request: vi.fn() },
    default: { request: vi.fn() },
}));

import apiClient from '@/api/apiClient';

describe('sendAgeVerification', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls apiClient.request with the provided actionUrl and default POST method', async () => {
        (apiClient.request as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });

        const result = await sendAgeVerification({ actionUrl: '/orders/abc123/age-verification' });

        expect(apiClient.request).toHaveBeenCalledWith({
            url: '/orders/abc123/age-verification',
            method: 'POST',
        });
        expect(result).toEqual({ success: true });
    });

    it('calls apiClient.request with the overridden method when method is provided', async () => {
        (apiClient.request as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });

        await sendAgeVerification({ actionUrl: '/orders/abc123/age-verification', method: 'PUT' });

        expect(apiClient.request).toHaveBeenCalledWith({
            url: '/orders/abc123/age-verification',
            method: 'PUT',
        });
    });

    it('throws when actionUrl is an empty string', async () => {
        await expect(sendAgeVerification({ actionUrl: '' })).rejects.toThrow(
            'Age verification actionUrl is missing!'
        );
        expect(apiClient.request).not.toHaveBeenCalled();
    });

    it('throws when actionUrl is undefined', async () => {
        // Simulate a caller that omits actionUrl (cast to bypass TS)
        await expect(sendAgeVerification({ actionUrl: undefined as unknown as string })).rejects.toThrow(
            'Age verification actionUrl is missing!'
        );
        expect(apiClient.request).not.toHaveBeenCalled();
    });

    it('propagates the error when apiClient.request rejects', async () => {
        (apiClient.request as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error('Network Error')
        );

        await expect(
            sendAgeVerification({ actionUrl: '/orders/abc123/age-verification' })
        ).rejects.toThrow('Network Error');
    });
});
