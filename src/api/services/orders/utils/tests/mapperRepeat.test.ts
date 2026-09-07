import { describe, it, expect } from 'vitest';
import { mapBackendOrderToFrontend } from '../mapper';

describe('mapBackendOrderToFrontend - Repeated Orders', () => {
    it('should correctly detect repeatedOrders from various field names', () => {
        const testCases = [
            { input: { repeatedOrders: 5 }, expected: 5 },
            { input: { repeated_orders: 10 }, expected: 10 },
            { input: { repeatCount: 15 }, expected: 15 },
            { input: { repeat_count: 20 }, expected: 20 },
            { input: { totalOrders: 25 }, expected: 25 },
            { input: { total_orders: 30 }, expected: 30 },
            { input: { orders_count: 35 }, expected: 35 },
            { input: { order_count: 40 }, expected: 40 },
            { input: { customerInfo: { totalOrders: 45 } }, expected: 45 },
            { input: { customer_order_count: 50 }, expected: 50 },
            { input: { customer: { orders_count: 55 } }, expected: 55 },
            { input: { customer: { total_orders: 60 } }, expected: 60 },
        ];

        testCases.forEach(({ input, expected }) => {
            const result = mapBackendOrderToFrontend(input);
            expect(result.repeatedOrders).toBe(expected);
        });
    });

    it('should fallback to string detection and filterHint', () => {
        expect(mapBackendOrderToFrontend({ order_type: 'repeat' }).repeatedOrders).toBe(1);
        expect(mapBackendOrderToFrontend({ order_type: 'First' }).repeatedOrders).toBe(0);
        expect(mapBackendOrderToFrontend({}, undefined, 'repeat').repeatedOrders).toBe(1);
        expect(mapBackendOrderToFrontend({}, undefined, 'first').repeatedOrders).toBe(0);
        expect(mapBackendOrderToFrontend({ repeatCount: 10 }, undefined, 'first').repeatedOrders).toBe(10);
    });

    it('should fallback to customer.orders_count - 1 if num is 0 but customer has history', () => {
        const input = { repeatCount: 0, customer: { orders_count: 5 } };
        expect(mapBackendOrderToFrontend(input).repeatedOrders).toBe(4);
    });

    it('should correctly map example order payload', () => {
        const example = {
            "id": "#1301",
            "shopifyOrderId": 6490125893701,
            "repeatedOrders": 17,
            "customer": { "id": 8170677928005 },
            "status": "cancelled",
            "documentsUploaded": true,
            "createdAt": "2026-03-14T06:33:10.553Z"
        };
        const result = mapBackendOrderToFrontend(example);
        expect(result.repeatedOrders).toBe(17);
    });
});
