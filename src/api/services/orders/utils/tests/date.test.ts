import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, getTimeAgo } from '../date';

describe('formatDate and getTimeAgo', () => {
    const baseTime = new Date('2024-02-20T12:00:00Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(baseTime);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns "—" for falsy values and handles invalid dates', () => {
        expect(formatDate(null)).toEqual({ date: '—', subtext: '' });
        expect(formatDate('invalid-date')).toEqual({ date: 'invalid-date', subtext: '' });
    });

    it('formats less than 1 minute ago as "Just now"', () => {
        const justNow = new Date('2024-02-20T11:59:45Z');
        expect(formatDate(justNow.toISOString()).subtext).toBe('Just now');
        expect(getTimeAgo(new Date('2024-02-20T12:00:00Z'))).toBe('Just now');
    });

    it.each([
        [1, '1 minute ago'],
        [5, '5 minutes ago'],
        [45, '45 minutes ago'],
        [59, '59 minutes ago'],
    ])('formats %i minute(s) ago as "%s"', (mins, expected) => {
        const d = new Date(baseTime.getTime() - mins * 60 * 1000);
        expect(getTimeAgo(d)).toBe(expected);
    });

    it('formats exactly 1 hour ago as "1 hour ago"', () => {
        const d = new Date(baseTime.getTime() - 60 * 60 * 1000);
        expect(getTimeAgo(d)).toBe('1 hour ago');
    });

    it.each([
        [2, '2 hours ago'],
        [5, '5 hours ago'],
        [23, '23 hours ago'],
    ])('formats %i hours ago as "%s"', (hours, expected) => {
        const d = new Date(baseTime.getTime() - hours * 60 * 60 * 1000);
        expect(getTimeAgo(d)).toBe(expected);
    });

    it('formats 1 day ago as "Yesterday"', () => {
        const yesterday = new Date('2024-02-19T10:00:00Z');
        expect(formatDate(yesterday.toISOString()).subtext).toBe('Yesterday');
    });

    it.each([
        [2, '2024-02-18T12:00:00Z', '2 days ago'],
        [4, '2024-02-16T13:00:00Z', '4 days ago'],
        [14, '2024-02-06T12:00:00Z', '14 days ago'],
    ])('formats %i days ago as "%s"', (_, dateStr, expected) => {
        expect(formatDate(dateStr).subtext).toBe(expected);
    });
});
