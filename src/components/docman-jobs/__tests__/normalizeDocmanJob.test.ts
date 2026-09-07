import { describe, it, expect } from 'vitest';
import { normalizeDocmanJob } from '../utils';

describe('normalizeDocmanJob', () => {
    it('returns empty object when job is falsy', () => {
        expect(normalizeDocmanJob(null)).toEqual({});
        expect(normalizeDocmanJob(undefined)).toEqual({});
    });

    it('normalizes field naming variations and parses string payload', () => {
        const raw = {
            id: 'job-123',
            laravelDocumentId: 'doc-456',
            commandType: 'generate_pdf',
            completedAt: '2026-03-01T10:00:00Z',
            created_at: '2026-03-01T09:00:00Z',
            status: 'completed',
            payload: JSON.stringify({ orderId: '1001' }),
            worker_id: 'worker-1',
            last_error: null,
            response: { success: true },
        };

        const result = normalizeDocmanJob(raw);

        expect(result.id).toBe('job-123');
        expect(result._id).toBe('job-123');
        expect(result.laravel_document_id).toBe('doc-456');
        expect(result.command_type).toBe('generate_pdf');
        expect(result.payload).toEqual({ orderId: '1001' });
        expect(result.workerId).toBe('worker-1');
        expect(result.status).toBe('completed');
    });

    it('handles malformed JSON payload safely without throwing', () => {
        const raw = {
            id: 'job-999',
            payload: '{ invalid-json',
        };

        const result = normalizeDocmanJob(raw);
        expect(result.payload).toEqual({});
    });
});
