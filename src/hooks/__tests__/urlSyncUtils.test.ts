import { describe, it, expect } from 'vitest';
import { getMappedValue, parseParamValue } from '../url/urlSyncUtils';

describe('urlSyncUtils', () => {
    describe('getMappedValue', () => {
        it('returns exact key value if present in params', () => {
            const params = new URLSearchParams('status=active&search=john');
            expect(getMappedValue(params, 'status')).toBe('active');
            expect(getMappedValue(params, 'search')).toBe('john');
        });

        it('resolves alias keys when primary key is missing', () => {
            const params1 = new URLSearchParams('customerId=cust_123');
            expect(getMappedValue(params1, 'customer')).toBe('cust_123');

            const params2 = new URLSearchParams('id=ORD-999');
            expect(getMappedValue(params2, 'orderId')).toBe('ORD-999');

            const params3 = new URLSearchParams('order_type=repeat');
            expect(getMappedValue(params3, 'repeatedOrders')).toBe('repeat');
        });

        it('returns null if neither primary key nor aliases exist', () => {
            const params = new URLSearchParams('page=2');
            expect(getMappedValue(params, 'nonExistentKey')).toBeNull();
        });
    });

    describe('parseParamValue', () => {
        it('parses documents filter values correctly', () => {
            expect(parseParamValue('uploaded', 'documents', '')).toBe('Uploaded');
            expect(parseParamValue('not_uploaded', 'documents', '')).toBe('Not Uploaded');
            expect(parseParamValue('not uploaded', 'documents', '')).toBe('Not Uploaded');
        });

        it('converts to boolean when current state value is boolean', () => {
            expect(parseParamValue('true', 'isUrgent', false)).toBe(true);
            expect(parseParamValue('false', 'isUrgent', true)).toBe(false);
        });

        it('converts to number when current state value is number', () => {
            expect(parseParamValue('42', 'limit', 10)).toBe(42);
        });

        it('returns raw string otherwise', () => {
            expect(parseParamValue('pending', 'status', '')).toBe('pending');
        });
    });
});
