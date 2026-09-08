import { describe, it, expect } from 'vitest';
import { normalizeOrderData } from '../../utils/dataNormalization';

const baseResponse = (overrides: Record<string, unknown> = {}) => ({
    products: [],
    consultationFlags: {},
    customerDocuments: {},
    sendVideoConsultation: { enabled: false, roomUrl: '', method: '', payload: {} },
    sendDocumentReminder: { enabled: false, actionUrl: '', method: '', payload: {} },
    sendPrescriptionReminder: { enabled: false, actionUrl: '', method: '', payload: {} },
    sendMessage: { enabled: false, actionUrl: '', method: '', payload: { id: '', message: '' } },
    ...overrides,
});

describe('normalizeOrderData — lineItemsRaw per-product scoping', () => {
    const mounjaro = {
        name: 'Mounjaro® Injectable Pen',
        quantity: 1, price: '159.99', product_id: 111,
        hasValidData: true, heightData: [], weightData: [], bmiData: [],
        consultationQuestions: [{ name: 'Height', value: '180 cm' }],
        sku: 'WDM-5193-2.5', categories: ['weight-loss'],
    };

    const vitamins = {
        name: 'Valupak Multivitamin 50 Tablets',
        quantity: 1, price: '3.98', product_id: 222,
        hasValidData: false, heightData: [], weightData: [], bmiData: [],
        consultationQuestions: [], sku: null, categories: [],
    };

    const shipment = {
        name: 'Shipment Protection',
        quantity: 1, price: '6.99', product_id: 333,
        hasValidData: false, heightData: [], weightData: [], bmiData: [],
        consultationQuestions: [], sku: 'MP-Shipment-Protection', categories: [],
    };

    const lineItemsRaw = [
        { product_id: 222, properties: [] },
        { product_id: 333, properties: [] },
        { product_id: 111, properties: [{ name: 'Height', value: '180 cm' }, { name: 'Weight', value: '85 kg' }] },
    ];

    it('gives each product only its own lineItemsRaw entry by product_id', () => {
        const result = normalizeOrderData(baseResponse({ products: [mounjaro, vitamins], lineItemsRaw }));
        const mounjaroProduct = result.products.find(p => p.product_id === 111);
        const vitaminsProduct = result.products.find(p => p.product_id === 222);

        expect(mounjaroProduct?.lineItemsRaw).toHaveLength(1);
        expect(mounjaroProduct?.lineItemsRaw?.[0].properties).toHaveLength(2);
        expect(vitaminsProduct?.lineItemsRaw).toHaveLength(1);
        expect(vitaminsProduct?.lineItemsRaw?.[0].properties).toHaveLength(0);
    });

    it('vitamins lineItemsRaw has no properties — cannot bleed Mounjaro questions', () => {
        const result = normalizeOrderData(baseResponse({ products: [mounjaro, vitamins], lineItemsRaw }));
        const vitaminsProduct = result.products.find(p => p.product_id === 222);
        const allProperties = vitaminsProduct?.lineItemsRaw?.flatMap(item => item.properties) ?? [];
        expect(allProperties).toHaveLength(0);
    });

    it('handles product with no matching lineItemsRaw or missing lineItemsRaw gracefully', () => {
        const result1 = normalizeOrderData(baseResponse({ products: [{ ...vitamins, product_id: 999 }], lineItemsRaw }));
        expect(result1.products.find(p => p.product_id === 999)?.lineItemsRaw).toEqual([]);

        const result2 = normalizeOrderData(baseResponse({ products: [mounjaro] }));
        expect(result2.products.find(p => p.product_id === 111)?.lineItemsRaw).toEqual([]);
    });

    it('filters out shipment product and preserves raw properties on clinical product', () => {
        const result = normalizeOrderData(baseResponse({ products: [mounjaro, shipment], lineItemsRaw }));
        expect(result.products.find(p => p.product_id === 333)).toBeUndefined();

        const props = result.products.find(p => p.product_id === 111)?.lineItemsRaw?.[0].properties ?? [];
        expect(props).toContainEqual({ name: 'Height', value: '180 cm' });
        expect(props).toContainEqual({ name: 'Weight', value: '85 kg' });
    });
});
