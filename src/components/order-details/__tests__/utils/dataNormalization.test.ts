import { describe, it, expect } from 'vitest';
import { normalizeOrderData } from '../../utils/dataNormalization';

/** Minimal valid response skeleton so other required fields don't crash normalisation */
function baseResponse(overrides: Record<string, unknown> = {}) {
    return {
        products: [],
        consultationFlags: {},
        customerDocuments: {},
        sendVideoConsultation: { enabled: false, roomUrl: '', method: '', payload: {} },
        sendDocumentReminder: { enabled: false, actionUrl: '', method: '', payload: {} },
        sendPrescriptionReminder: { enabled: false, actionUrl: '', method: '', payload: {} },
        sendMessage: { enabled: false, actionUrl: '', method: '', payload: { id: '', message: '' } },
        ...overrides,
    };
}

describe('normalizeOrderData — age verified fields', () => {
    describe('ageVerifiedReview', () => {
        it('passes through ageVerifiedReview when present', () => {
            const review = { emailSent: true, sentAt: '2024-05-01T10:00:00Z', sentBy: 'admin@example.com' };
            const result = normalizeOrderData(baseResponse({ ageVerifiedReview: review }));
            expect(result.ageVerifiedReview).toEqual(review);
        });

        it('defaults ageVerifiedReview to null when absent', () => {
            const result = normalizeOrderData(baseResponse());
            expect(result.ageVerifiedReview).toBeNull();
        });

        it('defaults ageVerifiedReview to null when explicitly null', () => {
            const result = normalizeOrderData(baseResponse({ ageVerifiedReview: null }));
            expect(result.ageVerifiedReview).toBeNull();
        });

        it('passes through ageVerifiedReview with emailSent false', () => {
            const review = { emailSent: false, sentAt: null, sentBy: null };
            const result = normalizeOrderData(baseResponse({ ageVerifiedReview: review }));
            expect(result.ageVerifiedReview).toEqual(review);
        });

        it('passes through ageVerifiedReview when sentAt and sentBy are omitted', () => {
            const review = { emailSent: true };
            const result = normalizeOrderData(baseResponse({ ageVerifiedReview: review }));
            expect(result.ageVerifiedReview).toEqual(review);
        });
    });

    describe('ageVerifiedEmail', () => {
        it('passes through ageVerifiedEmail when present', () => {
            const emailAction = { enabled: true, actionUrl: '/orders/abc/age-verification', method: 'POST' };
            const result = normalizeOrderData(baseResponse({ ageVerifiedEmail: emailAction }));
            expect(result.ageVerifiedEmail).toEqual(emailAction);
        });

        it('leaves ageVerifiedEmail undefined when not in the response', () => {
            const result = normalizeOrderData(baseResponse());
            expect(result.ageVerifiedEmail).toBeUndefined();
        });

        it('passes through ageVerifiedEmail with enabled false', () => {
            const emailAction = { enabled: false, actionUrl: '/orders/abc/age-verification', method: 'POST' };
            const result = normalizeOrderData(baseResponse({ ageVerifiedEmail: emailAction }));
            expect(result.ageVerifiedEmail).toEqual(emailAction);
        });
    });
});

describe('normalizeOrderData — lastPreviousOrder', () => {
    it('passes through lastPreviousOrder from backend including orderId', () => {
        const lastOrder = {
            orderId: '#114406',
            orderStatus: 'on_hold',
            fulfillmentStatus: 'on_hold',
            createdAt: '2026-06-04T06:22:04.000Z',
            dispatchedAt: null,
            cancelledAt: null,
            products: [{ name: 'Wegovy® Injectable' }],
        };
        const result = normalizeOrderData(baseResponse({ lastPreviousOrder: lastOrder }));
        expect(result.lastPreviousOrder).toEqual(lastOrder);
        expect(result.lastPreviousOrder?.orderId).toBe('#114406');
    });

    it('falls back to last_previous_order when the camelCase key is absent', () => {
        const lastOrder = {
            orderId: '#99001',
            orderStatus: 'fulfilled',
            createdAt: '2026-05-01T00:00:00.000Z',
            dispatchedAt: '2026-05-10T00:00:00.000Z',
            cancelledAt: null,
            products: [],
        };
        const result = normalizeOrderData(baseResponse({ last_previous_order: lastOrder }));
        expect(result.lastPreviousOrder).toEqual(lastOrder);
    });

    it('normalizes lastPreviousOrder to null when neither field is present', () => {
        const result = normalizeOrderData(baseResponse());
        expect(result.lastPreviousOrder).toBeNull();
    });

    it('normalizes lastPreviousOrder to null when explicitly set to null', () => {
        const result = normalizeOrderData(baseResponse({ lastPreviousOrder: null }));
        expect(result.lastPreviousOrder).toBeNull();
    });
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

    it('product with no matching lineItemsRaw entry gets an empty array', () => {
        const result = normalizeOrderData(baseResponse({
            products: [{ ...vitamins, product_id: 999 }],
            lineItemsRaw,
        }));
        const product = result.products.find(p => p.product_id === 999);
        expect(product?.lineItemsRaw).toEqual([]);
    });

    it('handles missing lineItemsRaw on the response gracefully', () => {
        const result = normalizeOrderData(baseResponse({ products: [mounjaro] }));
        const product = result.products.find(p => p.product_id === 111);
        expect(product?.lineItemsRaw).toEqual([]);
    });

    it('shipment product is filtered out even when it has a lineItemsRaw entry', () => {
        const result = normalizeOrderData(baseResponse({ products: [mounjaro, shipment], lineItemsRaw }));
        const shipmentProduct = result.products.find(p => p.product_id === 333);
        expect(shipmentProduct).toBeUndefined();
    });

    it('Mounjaro keeps all its own raw properties after scoping', () => {
        const result = normalizeOrderData(baseResponse({ products: [mounjaro, vitamins], lineItemsRaw }));
        const mounjaroProduct = result.products.find(p => p.product_id === 111);
        const props = mounjaroProduct?.lineItemsRaw?.[0].properties ?? [];
        expect(props).toContainEqual({ name: 'Height', value: '180 cm' });
        expect(props).toContainEqual({ name: 'Weight', value: '85 kg' });
    });
});
