import { describe, it, expect } from 'vitest';
import { parseProducts, detectCategory } from './products';

describe('parseProducts', () => {
    it('returns empty array for falsy objects', () => {
        expect(parseProducts(null)).toEqual([]);
        expect(parseProducts(undefined)).toEqual([]);
    });

    it('parses from line_items array', () => {
        const order = {
            line_items: [{ title: 'Product A', qty: 2, price: 10 }]
        };
        expect(parseProducts(order)).toEqual([{ name: 'Product A', quantity: 2, price: 10 }]);
    });

    it('parses from products array', () => {
        const order = {
            products: [{ name: 'Product B', quantity: 5, total_price: 100 }]
        };
        expect(parseProducts(order)).toEqual([{ name: 'Product B', quantity: 5, price: 100 }]);
    });

    it('filters out shipment protection (partial name match)', () => {
        const order = {
            products: [{ name: 'Test Product', quantity: 1, price: 50 }, { name: 'Shipment Protection Plus', quantity: 1, price: 2 }]
        };
        expect(parseProducts(order)).toEqual([{ name: 'Test Product', quantity: 1, price: 50 }]);
    });

    it('parses singular products field fallback', () => {
        expect(parseProducts({ productName: 'Single Item' })).toEqual([{ name: 'Single Item', quantity: 1 }]);
    });

    it('handles nested line_items in Shopify-style node/order wrapper', () => {
        const order = {
            order: {
                line_items: [{ name: 'Test Meds', qty: 1 }]
            },
            products: "N/A"
        };
        expect(parseProducts(order)).toEqual([{ name: 'Test Meds', quantity: 1, price: 0 }]);
    });

    it('ignores "N/A" string values in favor of real data', () => {
        const order = {
            line_items: [{ name: 'Real Product', qty: 1 }],
            products: "N/A"
        };
        expect(parseProducts(order)).toEqual([{ name: 'Real Product', quantity: 1, price: 0 }]);
    });

    it('returns empty array if ONLY "N/A" is present', () => {
        const order = { products: "N/A" };
        expect(parseProducts(order)).toEqual([]);
    });
});

describe('detectCategory', () => {
    it('detects ED', () => {
        expect(detectCategory('Buy Viagra Online')).toBe('ED');
        expect(detectCategory([{ name: 'sildenafil', quantity: 1, price: 0 }])).toBe('ED');
    });

    it('detects Weight Loss', () => {
        expect(detectCategory('Wegovy Pen')).toBe('Weight Loss');
        expect(detectCategory('Ozempic Injection')).toBe('Weight Loss');
    });

    it('detects Hair Loss', () => {
        expect(detectCategory('finasteride tablets')).toBe('Hair Loss');
    });

    it('defaults to Other', () => {
        expect(detectCategory('Some random product')).toBe('Other');
        expect(detectCategory('')).toBe('Other');
        expect(detectCategory([])).toBe('Other');
    });
});
