import { describe, it, expect } from 'vitest';
import { slugify, cn, capitalize, escapeRegex } from './string';

describe('string helpers', () => {
    describe('escapeRegex', () => {
        it('escapes special regex characters correctly', () => {
            expect(escapeRegex('MP-(100)')).toBe('MP-\\(100\\)');
            expect(escapeRegex('test[123]')).toBe('test\\[123\\]');
            expect(escapeRegex('price+$100?*')).toBe('price\\+\\$100\\?\\*');
            expect(escapeRegex('user^name.with|pipe')).toBe('user\\^name\\.with\\|pipe');
        });

        it('handles empty or non-string input safely', () => {
            expect(escapeRegex('')).toBe('');
            expect(escapeRegex(null as any)).toBe('');
            expect(escapeRegex(undefined as any)).toBe('');
        });
    });

    describe('slugify', () => {

        it('converts basic text to url safe slug', () => {
            expect(slugify('MediPulse UK')).toBe('medipulse-uk');
            expect(slugify('Hello World!')).toBe('hello-world');
        });

        it('handles leading, trailing, and duplicate spaces/hyphens', () => {
            expect(slugify('   multiple   spaces  ')).toBe('multiple-spaces');
            expect(slugify('--already-hyphenated--')).toBe('already-hyphenated');
            expect(slugify('special!@#$%^&*()characters')).toBe('specialcharacters');
        });

        it('handles empty strings', () => {
            expect(slugify('')).toBe('');
        });
    });

    describe('cn', () => {
        it('joins class names filtering falsy values', () => {
            expect(cn('btn', 'btn-primary', false, null, undefined, 'active')).toBe('btn btn-primary active');
        });

        it('handles empty input', () => {
            expect(cn()).toBe('');
            expect(cn('', null, false)).toBe('');
        });
    });

    describe('capitalize', () => {
        it('capitalizes the first character', () => {
            expect(capitalize('injectable')).toBe('Injectable');
            expect(capitalize('order')).toBe('Order');
        });

        it('returns empty string if falsy', () => {
            expect(capitalize('')).toBe('');
        });

        it('preserves already capitalized string', () => {
            expect(capitalize('Active')).toBe('Active');
        });
    });
});
