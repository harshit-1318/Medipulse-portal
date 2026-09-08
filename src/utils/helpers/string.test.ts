import { describe, it, expect } from 'vitest';
import { slugify, cn, capitalize } from './string';

describe('string helpers', () => {
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
