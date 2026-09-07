import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime } from '../utils/formatPrescriptionDate';

describe('formatPrescriptionDate', () => {
    describe('formatDate', () => {
        it('formats ISO dates in en-GB 2-digit format', () => {
            const formatted = formatDate('2026-04-15T12:00:00Z');
            expect(formatted).toMatch(/15\s+Apr\s+26/);
        });

        it('handles invalid date strings gracefully', () => {
            expect(formatDate('invalid-date')).toBe('invalid-date');
            expect(formatDate('')).toBe('N/A');
        });
    });

    describe('formatRelativeTime', () => {
        it('formats timestamps under a minute as just now', () => {
            const now = new Date().toISOString();
            expect(formatRelativeTime(now)).toBe('just now');
        });

        it('formats minutes ago correctly', () => {
            const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
            expect(formatRelativeTime(tenMinsAgo)).toBe('10m ago');
        });

        it('formats hours ago correctly', () => {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
            expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');
        });

        it('formats days ago correctly', () => {
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
            expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago');
        });
    });
});
