import { describe, it, expect } from 'vitest';
import { normalizeStatus, resolveRawOrderStatus } from './status';

describe('normalizeStatus', () => {
    it('handles null/undefined values', () => {
        expect(normalizeStatus(null)).toBe('');
        expect(normalizeStatus('null')).toBe('');
        expect(normalizeStatus(undefined)).toBe('');
        expect(normalizeStatus('')).toBe('');
    });

    it('maps common statuses correctly', () => {
        expect(normalizeStatus('on hold')).toBe('On Hold');
        expect(normalizeStatus('pending')).toBe('On Hold');
        expect(normalizeStatus('unfulfilled')).toBe('Unfulfilled');
        expect(normalizeStatus('fulfilled')).toBe('Fulfilled');
        expect(normalizeStatus('complete')).toBe('Fulfilled');
        expect(normalizeStatus('cancelled')).toBe('Cancelled');
        expect(normalizeStatus('void')).toBe('Cancelled');
    });

    it('capitalizes unknown statuses', () => {
        expect(normalizeStatus('processing')).toBe('Processing');
        expect(normalizeStatus('READY')).toBe('Ready');
    });
});

describe('resolveRawOrderStatus', () => {
    it('prioritizes on_hold when either status source is on hold', () => {
        expect(resolveRawOrderStatus({ fulfillment_status: 'fulfilled', status: 'on_hold' })).toBe('on_hold');
        expect(resolveRawOrderStatus({ fulfillmentStatus: 'on hold', status: 'fulfilled' })).toBe('on_hold');
    });

    it('uses nested orderInfo values before root-level fields', () => {
        expect(
            resolveRawOrderStatus({
                status: 'fulfilled',
                orderInfo: { status: 'cancelled' },
            }),
        ).toBe('cancelled');
    });

    it('falls back to raw_data fulfillment_status when top-level status is stale', () => {
        expect(
            resolveRawOrderStatus({
                status: 'unfulfilled',
                raw_data: { fulfillment_status: 'fulfilled' },
            }),
        ).toBe('fulfilled');
    });
});
