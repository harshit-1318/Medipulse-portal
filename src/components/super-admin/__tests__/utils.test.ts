import { describe, it, expect } from 'vitest';
import {
    formatDate,
    shortDate,
    formatActionLabel,
    pad2,
    PERIOD_OPTIONS,
    COMM_ACTION_LABELS,
} from '../activity-dashboard/utils';

describe('super-admin activity-dashboard utils', () => {
    it('formatDate formats valid ISO dates correctly', () => {
        const formatted = formatDate('2026-05-10T14:30:00.000Z');
        expect(formatted).toContain('2026');
        expect(formatted).toContain('May');
    });

    it('shortDate formats day and short month', () => {
        const formatted = shortDate('2026-05-10T14:30:00.000Z');
        expect(formatted).toContain('May');
        expect(formatted).toContain('10');
    });

    it('formatActionLabel converts snake_case to Title Case', () => {
        expect(formatActionLabel('user_created')).toBe('User Created');
        expect(formatActionLabel('order_status_updated')).toBe('Order Status Updated');
    });

    it('pad2 pads single digit numbers to two digits', () => {
        expect(pad2(5)).toBe('05');
        expect(pad2(12)).toBe('12');
        expect(pad2(0)).toBe('00');
    });

    it('exposes defined PERIOD_OPTIONS and COMM_ACTION_LABELS', () => {
        expect(PERIOD_OPTIONS.length).toBe(3);
        expect(COMM_ACTION_LABELS.video_consultation_sent).toBe('Video Consultation');
        expect(COMM_ACTION_LABELS.gp_email_sent).toBe('GP Correspondence');
    });
});
