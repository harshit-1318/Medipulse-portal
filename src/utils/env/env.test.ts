import { describe, expect, it } from 'vitest';
import {
    getFirstDefinedEnvValue,
    isEnvFlagEnabled,
    isTruthyEnvValue,
    normalizeEnvValue,
} from './env';

describe('env utility', () => {
    describe('normalizeEnvValue', () => {
        it('normalizes casing and whitespace', () => {
            expect(normalizeEnvValue('  TRUE ')).toBe('true');
        });

        it('normalizes nullish values to empty string', () => {
            expect(normalizeEnvValue(undefined)).toBe('');
            expect(normalizeEnvValue(null)).toBe('');
        });
    });

    describe('getFirstDefinedEnvValue', () => {
        it('returns first defined non-null value', () => {
            expect(getFirstDefinedEnvValue(undefined, null, 'yes', 'true')).toBe('yes');
        });

        it('returns undefined when no value is defined', () => {
            expect(getFirstDefinedEnvValue(undefined, null)).toBeUndefined();
        });
    });

    describe('isTruthyEnvValue', () => {
        it('accepts common truthy variants', () => {
            expect(isTruthyEnvValue('true')).toBe(true);
            expect(isTruthyEnvValue('1')).toBe(true);
            expect(isTruthyEnvValue(' yes ')).toBe(true);
            expect(isTruthyEnvValue('ON')).toBe(true);
        });

        it('rejects falsy and unknown values', () => {
            expect(isTruthyEnvValue('false')).toBe(false);
            expect(isTruthyEnvValue('0')).toBe(false);
            expect(isTruthyEnvValue('maybe')).toBe(false);
        });
    });

    describe('isEnvFlagEnabled', () => {
        it('uses first available value in priority order', () => {
            expect(isEnvFlagEnabled(undefined, '1', 'false')).toBe(true);
            expect(isEnvFlagEnabled('false', 'true')).toBe(false);
        });
    });
});
