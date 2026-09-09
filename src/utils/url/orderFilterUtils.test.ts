import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { parseFiltersFromParams, getInitialOrderFilters, STORAGE_VERSION } from './orderFilterUtils';
import type { OrderFilters } from '@/components/orders-table/types';

describe('orderFilterUtils', () => {
    const defaultFilters: OrderFilters = {
        limit: 20,
        sortBy: 'date',
        sort: 'desc',
        orderId: '',
        status: '',
        category: '',
        isUrgent: false,
        isParked: false,
    };

    beforeEach(() => {
        window.history.pushState({}, '', '/orders');
        localStorage.clear();
    });

    afterEach(() => {
        window.history.pushState({}, '', '/');
        localStorage.clear();
    });

    describe('parseFiltersFromParams', () => {
        it('parses basic query parameters matching defaults', () => {
            const params = new URLSearchParams('limit=50&orderId=1001&sort=asc');
            const parsed = parseFiltersFromParams(params, defaultFilters);
            expect(parsed.limit).toBe(50);
            expect(parsed.orderId).toBe('1001');
            expect(parsed.sort).toBe('asc');
        });

        it('handles common parameter aliases (e.g. customerId, id, orderStatus)', () => {
            const params = new URLSearchParams('customerId=cust123&id=99999&orderStatus=FULFILLED&sortDir=asc');
            const defaults = { customer: '', orderId: '', status: '', sort: 'desc' as const };
            const parsed = parseFiltersFromParams(params, defaults);
            expect(parsed.customer).toBe('cust123');
            expect(parsed.orderId).toBe('99999');
            expect(parsed.status).toBe('FULFILLED');
            expect(parsed.sort).toBe('asc');
        });

        it('normalizes documentStatus values', () => {
            const params = new URLSearchParams('documentStatus=uploaded');
            const defaults = { documents: '' };
            const parsed = parseFiltersFromParams(params, defaults);
            expect(parsed.documents).toBe('Uploaded');

            const params2 = new URLSearchParams('documentStatus=not_uploaded');
            const parsed2 = parseFiltersFromParams(params2, defaults);
            expect(parsed2.documents).toBe('Not Uploaded');
        });
    });

    describe('getInitialOrderFilters', () => {
        it('returns defaults when URL has no params and storage is empty', () => {
            const result = getInitialOrderFilters(defaultFilters, 'orders_storage');
            expect(result).toEqual(defaultFilters);
        });

        it('restores stored filters if version matches STORAGE_VERSION', () => {
            localStorage.setItem('orders_storage', JSON.stringify({
                _v: STORAGE_VERSION,
                orderId: 'restored-order',
                limit: 100,
            }));

            const result = getInitialOrderFilters(defaultFilters, 'orders_storage');
            expect(result.orderId).toBe('restored-order');
            expect(result.limit).toBe(100);
        });

        it('discards and removes stored filters if version mismatches', () => {
            localStorage.setItem('orders_storage', JSON.stringify({
                _v: 1, // older version
                orderId: 'stale-order',
            }));

            const result = getInitialOrderFilters(defaultFilters, 'orders_storage');
            expect(result.orderId).toBe('');
            expect(localStorage.getItem('orders_storage')).toBeNull();
        });

        it('cleans up legacy sortBy: id from stored filters and reverts to default sortBy', () => {
            localStorage.setItem('orders_storage', JSON.stringify({
                _v: STORAGE_VERSION,
                sortBy: 'id',
                limit: 50,
            }));

            const result = getInitialOrderFilters(defaultFilters, 'orders_storage');
            expect(result.sortBy).toBe('date');
            expect(result.limit).toBe(50);
        });

        it('cleans up legacy sortBy: createdAt from stored filters and reverts to default sortBy', () => {
            localStorage.setItem('orders_storage', JSON.stringify({
                _v: STORAGE_VERSION,
                sortBy: 'createdAt',
                limit: 30,
            }));

            const result = getInitialOrderFilters(defaultFilters, 'orders_storage');
            expect(result.sortBy).toBe('date');
            expect(result.limit).toBe(30);
        });
    });
});
