import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    normalizeSortOrder,
    normalizeSortBy,
    getUrlParam,
    getUrlParamBool,
    getUrlParamInt
} from './urlBase';

describe('urlBase utilities', () => {
    describe('normalizeSortOrder', () => {
        it('normalizes asc aliases to asc', () => {
            expect(normalizeSortOrder('asc')).toBe('asc');
            expect(normalizeSortOrder('ascending')).toBe('asc');
            expect(normalizeSortOrder(' ASC ')).toBe('asc');
        });

        it('normalizes desc aliases to desc', () => {
            expect(normalizeSortOrder('desc')).toBe('desc');
            expect(normalizeSortOrder('descending')).toBe('desc');
            expect(normalizeSortOrder('dsc')).toBe('desc');
        });

        it('defaults to desc for undefined or invalid values', () => {
            expect(normalizeSortOrder(undefined)).toBe('desc');
            expect(normalizeSortOrder('')).toBe('desc');
            expect(normalizeSortOrder('invalid')).toBe('desc');
        });
    });

    describe('normalizeSortBy', () => {
        it('maps products to product', () => {
            expect(normalizeSortBy('products')).toBe('product');
        });

        it('maps createdAt to date', () => {
            expect(normalizeSortBy('createdAt')).toBe('date');
        });

        it('preserves other sortBy keys', () => {
            expect(normalizeSortBy('date')).toBe('date');
            expect(normalizeSortBy('status')).toBe('status');
        });
    });

    describe('URL parameter parsers (window.location)', () => {
        beforeEach(() => {
            window.history.pushState({}, '', '/orders?search=test&urgent=true&page=3');
            localStorage.clear();
        });

        afterEach(() => {
            window.history.pushState({}, '', '/');
            localStorage.clear();
        });

        it('reads string URL parameter', () => {
            expect(getUrlParam('search')).toBe('test');
            expect(getUrlParam('missing', 'default')).toBe('default');
        });

        it('reads boolean URL parameter', () => {
            expect(getUrlParamBool('urgent')).toBe(true);
            expect(getUrlParamBool('missing', false)).toBe(false);
        });

        it('reads integer URL parameter', () => {
            expect(getUrlParamInt('page')).toBe(3);
            expect(getUrlParamInt('missing', 1)).toBe(1);
        });

        it('reads integer from localStorage fallback when query param is absent', () => {
            localStorage.setItem('testStorage', JSON.stringify({ page: 5 }));
            expect(getUrlParamInt('limit', 10, 'testStorage')).toBe(10);
            expect(getUrlParamInt('page', 1, 'testStorage')).toBe(3); // URL wins over localStorage
        });
    });
});
