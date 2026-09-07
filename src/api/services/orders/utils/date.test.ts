import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
    beforeEach(() => {
        // Mock current time to 2024-02-20
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-02-20T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns "—" for falsy values', () => {
        const result = formatDate(null);
        expect(result.date).toBe('—');
        expect(result.subtext).toBe('');
    });

    it('formats a date and shows relative time correctly', () => {
        // 2 days ago
        const twoDaysAgo = new Date('2024-02-18T12:00:00Z');
        const result = formatDate(twoDaysAgo.toISOString());

        expect(result.date).toBe('18 Feb 24');
        expect(result.subtext).toBe('2d ago');
    });

    it('correctly calculates 4 days ago even if less than 96 hours have passed', () => {
        // Current time: 2024-02-20T12:00:00Z (Mocked)
        // Past time: 2024-02-16T13:00:00Z
        // Actual elapsed: 3 days, 23 hours
        // Calendar days: 20 - 16 = 4
        const result = formatDate('2024-02-16T13:00:00Z');
        expect(result.subtext).toBe('4d ago');
    });

    it('shows "Just now" for very recent dates', () => {
        const justNow = new Date('2024-02-20T11:59:50Z');
        const result = formatDate(justNow.toISOString());
        expect(result.subtext).toBe('Just now');
    });

    it('returns the raw string if parsing fails', () => {
        const result = formatDate('invalid-date');
        expect(result.date).toBe('invalid-date');
        expect(result.subtext).toBe('');
    });
});
