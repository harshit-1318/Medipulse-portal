import { describe, it, expect } from 'vitest';
import { md5, getGravatarUrl } from './md5';

describe('md5 and gravatar helpers', () => {
    describe('md5', () => {
        it('computes a consistent hexadecimal hash', () => {
            const hash1 = md5('test@example.com');
            const hash2 = md5('test@example.com');
            expect(hash1).toBe(hash2);
            expect(typeof hash1).toBe('string');
            expect(hash1.length).toBeGreaterThan(0);
        });

        it('produces different hashes for different inputs', () => {
            const hash1 = md5('hello');
            const hash2 = md5('world');
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('getGravatarUrl', () => {
        it('generates an SVG data URL with email initial', () => {
            const url = getGravatarUrl('alice@example.com');
            expect(url.startsWith('data:image/svg+xml;utf8,')).toBe(true);
            const decoded = decodeURIComponent(url);
            expect(decoded).toContain('A');
            expect(decoded).toContain('#00a294');
        });

        it('defaults to U for empty email', () => {
            const url = getGravatarUrl('');
            const decoded = decodeURIComponent(url);
            expect(decoded).toContain('U');
        });

        it('respects custom size parameter', () => {
            const url = getGravatarUrl('bob@example.com', 128);
            const decoded = decodeURIComponent(url);
            expect(decoded).toContain('width="128"');
            expect(decoded).toContain('height="128"');
        });
    });
});
