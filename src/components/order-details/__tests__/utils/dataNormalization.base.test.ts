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

describe('normalizeOrderData — age verified fields', () => {
    it('passes through ageVerifiedReview correctly or defaults to null', () => {
        const review = { emailSent: true, sentAt: '2024-05-01T10:00:00Z', sentBy: 'admin@example.com' };
        expect(normalizeOrderData(baseResponse({ ageVerifiedReview: review })).ageVerifiedReview).toEqual(review);
        expect(normalizeOrderData(baseResponse()).ageVerifiedReview).toBeNull();
        expect(normalizeOrderData(baseResponse({ ageVerifiedReview: null })).ageVerifiedReview).toBeNull();
    });

    it('passes through ageVerifiedReview with partial or false flags', () => {
        const reviewFalse = { emailSent: false, sentAt: null, sentBy: null };
        expect(normalizeOrderData(baseResponse({ ageVerifiedReview: reviewFalse })).ageVerifiedReview).toEqual(reviewFalse);
        expect(normalizeOrderData(baseResponse({ ageVerifiedReview: { emailSent: true } })).ageVerifiedReview).toEqual({ emailSent: true });
    });

    it('passes through or leaves ageVerifiedEmail undefined', () => {
        const action = { enabled: true, actionUrl: '/orders/abc/age-verification', method: 'POST' };
        expect(normalizeOrderData(baseResponse({ ageVerifiedEmail: action })).ageVerifiedEmail).toEqual(action);
        expect(normalizeOrderData(baseResponse()).ageVerifiedEmail).toBeUndefined();

        const actionDisabled = { enabled: false, actionUrl: '/orders/abc/age-verification', method: 'POST' };
        expect(normalizeOrderData(baseResponse({ ageVerifiedEmail: actionDisabled })).ageVerifiedEmail).toEqual(actionDisabled);
    });
});

describe('normalizeOrderData — lastPreviousOrder', () => {
    it('passes through lastPreviousOrder and falls back to last_previous_order', () => {
        const lastOrder = {
            orderId: '#114406',
            orderStatus: 'on_hold',
            fulfillmentStatus: 'on_hold',
            createdAt: '2026-06-04T06:22:04.000Z',
            dispatchedAt: null,
            cancelledAt: null,
            products: [{ name: 'Wegovy® Injectable' }],
        };
        expect(normalizeOrderData(baseResponse({ lastPreviousOrder: lastOrder })).lastPreviousOrder).toEqual(lastOrder);

        const snakeOrder = { ...lastOrder, orderId: '#99001' };
        expect(normalizeOrderData(baseResponse({ last_previous_order: snakeOrder })).lastPreviousOrder).toEqual(snakeOrder);
    });

    it('normalizes lastPreviousOrder to null when absent or explicitly null', () => {
        expect(normalizeOrderData(baseResponse()).lastPreviousOrder).toBeNull();
        expect(normalizeOrderData(baseResponse({ lastPreviousOrder: null })).lastPreviousOrder).toBeNull();
    });
});
