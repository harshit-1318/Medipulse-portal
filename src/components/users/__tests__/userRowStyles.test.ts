import { describe, it, expect } from 'vitest';
import { formatCreatedDate, getAvatarStyles, getRoleStyles } from '../utils/userRowStyles';

describe('userRowStyles utils', () => {
    describe('formatCreatedDate', () => {
        it('returns em-dash for undefined or empty string', () => {
            expect(formatCreatedDate(undefined)).toBe('—');
            expect(formatCreatedDate('')).toBe('—');
        });

        it('returns em-dash for invalid date string', () => {
            expect(formatCreatedDate('invalid-date')).toBe('—');
        });

        it('formats valid ISO date correctly in en-GB locale', () => {
            const result = formatCreatedDate('2026-03-15T00:00:00.000Z');
            expect(result).toContain('2026');
            expect(result).toContain('Mar');
            expect(result).toContain('15');
        });
    });

    describe('getAvatarStyles', () => {
        it('returns deterministic gradient string for a given id', () => {
            const style1 = getAvatarStyles('user-123');
            const style2 = getAvatarStyles('user-123');
            expect(style1).toBe(style2);
            expect(style1).toContain('bg-linear-to-br');
        });
    });

    describe('getRoleStyles', () => {
        it('returns purple styles when isSuper is true regardless of role', () => {
            const styles = getRoleStyles('admin', true);
            expect(styles).toContain('text-purple-700');
        });

        it('returns specific styles for standard roles', () => {
            expect(getRoleStyles('admin')).toContain('text-indigo-700');
            expect(getRoleStyles('driver')).toContain('text-amber-700');
            expect(getRoleStyles('prescriber')).toContain('text-[#00a294]');
            expect(getRoleStyles('pharmacist')).toContain('text-cyan-700');
            expect(getRoleStyles('pharmacy_staff')).toContain('text-emerald-700');
            expect(getRoleStyles('customer_support')).toContain('text-sky-700');
            expect(getRoleStyles('unknown_role')).toContain('text-slate-600');
        });
    });
});
