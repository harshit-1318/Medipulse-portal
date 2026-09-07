import { describe, it, expect } from 'vitest';
import type { Product } from '../../types';
import {
    hasResyncTimestamp,
    isClinicalOrder,
    isClinicalProduct,
    isWeightLossProduct,
    shouldAutoResyncOrder,
} from '../../utils/order';

function createProduct(overrides: Partial<Product> = {}): Product {
    return {
        name: 'Generic Product',
        quantity: 1,
        price: '0',
        product_id: 1,
        categories: [],
        hasValidData: false,
        heightData: [],
        weightData: [],
        bmiData: [],
        consultationQuestions: [],
        lineItemsRaw: [],
        ...overrides,
    };
}

describe('order utilities', () => {
    describe('isWeightLossProduct', () => {
        it('matches known weight loss SKUs', () => {
            const product = createProduct({
                name: 'Unknown Name',
                sku: 'WDM-5193-5',
                categories: [],
            });

            expect(isWeightLossProduct(product)).toBe(true);
        });

        it('does not match non-weight-loss add-ons', () => {
            const product = createProduct({
                name: 'Valupak Multivitamin',
                sku: 'VALUPAK-MULTI',
                categories: ['supplements'],
            });

            expect(isWeightLossProduct(product)).toBe(false);
        });
    });

    describe('isClinicalProduct', () => {
        it('returns true for clinical medication by category', () => {
            const product = createProduct({
                name: 'Mounjaro Injectable Pen',
                categories: ['weight loss'],
            });

            expect(isClinicalProduct(product)).toBe(true);
        });

        it('returns false for add-ons like vitamins and needles', () => {
            const vitamin = createProduct({
                name: 'Valupak Vitamin D3 1000IU',
                categories: ['vitamins'],
            });
            const needles = createProduct({
                name: 'x100 Needles',
                categories: ['accessories'],
            });

            expect(isClinicalProduct(vitamin)).toBe(false);
            expect(isClinicalProduct(needles)).toBe(false);
        });
    });

    describe('isClinicalOrder', () => {
        it('returns true when at least one product is clinical', () => {
            const products: Product[] = [
                createProduct({ name: 'Valupak Multivitamin', categories: ['supplements'] }),
                createProduct({ name: 'Wegovy 1mg', categories: ['weight loss'] }),
            ];

            expect(isClinicalOrder(products)).toBe(true);
        });

        it('returns false when all products are non-clinical', () => {
            const products: Product[] = [
                createProduct({ name: 'Valupak Multivitamin', categories: ['supplements'] }),
                createProduct({ name: 'x100 Needles', categories: ['accessories'] }),
            ];

            expect(isClinicalOrder(products)).toBe(false);
        });
    });

    describe('resync helpers', () => {
        it('detects a valid resynced timestamp', () => {
            expect(hasResyncTimestamp('2026-04-27T10:00:00.000Z')).toBe(true);
            expect(hasResyncTimestamp(new Date('2026-04-27T10:00:00.000Z'))).toBe(true);
            expect(hasResyncTimestamp(1714212000000)).toBe(true);
        });

        it('treats empty or invalid values as not resynced', () => {
            expect(hasResyncTimestamp('')).toBe(false);
            expect(hasResyncTimestamp('invalid-date')).toBe(false);
            expect(hasResyncTimestamp(null)).toBe(false);
            expect(hasResyncTimestamp(undefined)).toBe(false);
        });

        it('returns true for auto-resync when resync timestamp is missing', () => {
            expect(shouldAutoResyncOrder(null)).toBe(true);
            expect(shouldAutoResyncOrder('')).toBe(true);
            expect(shouldAutoResyncOrder('2026-04-27T10:00:00.000Z')).toBe(false);
        });

        it('does not auto-resync when backend signal is absent', () => {
            expect(shouldAutoResyncOrder(undefined)).toBe(false);
        });
    });
});
