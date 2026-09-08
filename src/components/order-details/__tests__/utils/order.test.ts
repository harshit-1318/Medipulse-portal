import { describe, it, expect } from 'vitest';
import type { Product } from '../../types';
import {
    hasResyncTimestamp,
    isClinicalOrder,
    isClinicalProduct,
    isWeightLossProduct,
    shouldAutoResyncOrder,
} from '../../utils/order';

const mkProd = (overrides: Partial<Product> = {}): Product => ({
    name: 'Generic', quantity: 1, price: '0', product_id: 1, categories: [],
    hasValidData: false, heightData: [], weightData: [], bmiData: [],
    consultationQuestions: [], lineItemsRaw: [], ...overrides,
});

describe('order utilities', () => {
    describe('isWeightLossProduct', () => {
        it('matches weight loss SKU and rejects non-weight-loss add-ons', () => {
            expect(isWeightLossProduct(mkProd({ sku: 'WDM-5193-5' }))).toBe(true);
            expect(isWeightLossProduct(mkProd({ sku: 'VALUPAK-MULTI', categories: ['supplements'] }))).toBe(false);
        });
    });

    describe('isClinicalProduct', () => {
        it('returns true for clinical category and false for add-ons', () => {
            expect(isClinicalProduct(mkProd({ categories: ['weight loss'] }))).toBe(true);
            expect(isClinicalProduct(mkProd({ categories: ['vitamins'] }))).toBe(false);
            expect(isClinicalProduct(mkProd({ categories: ['accessories'] }))).toBe(false);
        });
    });

    describe('isClinicalOrder', () => {
        it('returns true when any product is clinical and false otherwise', () => {
            expect(isClinicalOrder([mkProd({ categories: ['supplements'] }), mkProd({ categories: ['weight loss'] })])).toBe(true);
            expect(isClinicalOrder([mkProd({ categories: ['supplements'] }), mkProd({ categories: ['accessories'] })])).toBe(false);
        });
    });

    describe('resync helpers', () => {
        it.each([
            ['2026-04-27T10:00:00.000Z', true],
            [new Date('2026-04-27T10:00:00.000Z'), true],
            [1714212000000, true],
            ['', false],
            ['invalid-date', false],
            [null, false],
            [undefined, false],
        ])('hasResyncTimestamp(%o) -> %s', (val, expected) => {
            expect(hasResyncTimestamp(val as any)).toBe(expected);
        });

        it.each([
            [null, true],
            ['', true],
            ['2026-04-27T10:00:00.000Z', false],
            [undefined, false],
        ])('shouldAutoResyncOrder(%o) -> %s', (val, expected) => {
            expect(shouldAutoResyncOrder(val as any)).toBe(expected);
        });
    });
});
