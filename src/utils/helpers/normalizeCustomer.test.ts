import { describe, it, expect } from 'vitest';
import { normalizeCustomer } from './normalizeCustomer';

describe('normalizeCustomer', () => {
    it('should handle string customer input', () => {
        const order = { customer: 'John Doe' };
        expect(normalizeCustomer(order)).toEqual({
            name: 'John Doe',
            email: '--',
            id: '--'
        });
    });

    it('should normalize object customer input', () => {
        const order = {
            customer: {
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane@example.com',
                id: 123
            }
        };
        expect(normalizeCustomer(order)).toEqual({
            name: 'Jane Smith',
            email: 'jane@example.com',
            id: 123
        });
    });

    it('should handle partial customer object', () => {
        const order = {
            customer: { first_name: 'OnlyFirst' }
        };
        expect(normalizeCustomer(order)).toEqual({
            name: 'OnlyFirst',
            email: '--',
            id: '--'
        });
    });

    it('should handle empty/null customer', () => {
        expect(normalizeCustomer({})).toEqual({
            name: '--',
            email: '--',
            id: '--'
        });
    });

    it('should fall back to customerName, customerEmail, and store_order_id when customer object is absent', () => {
        const order = {
            customerName: 'Alice Walker',
            customerEmail: 'alice@example.com',
            store_order_id: '45678',
        };
        expect(normalizeCustomer(order)).toEqual({
            name: 'Alice Walker',
            email: 'alice@example.com',
            id: '45678',
        });
    });
});
