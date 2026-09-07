import { describe, it, expect } from 'vitest';
import { mapToActivityLog } from '../mappers';

describe('mapToActivityLog', () => {
    it('maps standard backend log shape correctly', () => {
        const raw = {
            _id: 'abc123',
            action_type: 'order_viewed',
            view: 'orders',
            user_email: 'john@clinic.com',
            user_name: 'john',
            object_guid: '9999',
            details: 'Order #9999 viewed by john',
            createdAt: '2026-04-23T10:00:00Z',
            count: 3,
        };

        const result = mapToActivityLog(raw);

        expect(result).toMatchObject({
            id: 'abc123',
            action: 'order_viewed',
            page: 'orders',
            userEmail: 'john@clinic.com',
            userName: 'john',
            orderId: '9999',
            details: 'Order #9999 viewed by john',
            createdAt: '2026-04-23T10:00:00Z',
            count: 3,
        });
    });

    it('handles fallback defaults for missing fields', () => {
        const r1 = mapToActivityLog({ _id: 'id1', action_type: 'login', view: 'auth', user_email: 'alice@x.com', object_guid: '', createdAt: '2026' });
        expect(r1.userName).toBe('alice');

        const r2 = mapToActivityLog({ _id: 'id2', action_type: 'order', view: 'orders', user_email: 'a@b.com', subject_guid: 'user', object_guid: '12345', createdAt: '2026' });
        expect(r2.orderId).toBe('12345');

        const r3 = mapToActivityLog({ _id: 'id3', action_type: 'order', view: 'orders', user_email: 'a@b.com', object_guid: '1', createdAt: '2026' });
        expect(r3.count).toBe(1);

        const r4 = mapToActivityLog({ _id: 'id4', action_type: 'login', view: 'auth', user_email: 'a@b.com', object_guid: '', createdAt: '2026' });
        expect(r4.details).toBe('');
    });

    it('handles already-mapped shape (userName/orderId fields)', () => {
        const raw = {
            id: 'id5',
            action: 'order_viewed',
            page: 'orders',
            userEmail: 'b@b.com',
            userName: 'bob',
            orderId: '777',
            details: 'some detail',
            createdAt: '2026-04-23T10:00:00Z',
            count: 2,
        };

        const result = mapToActivityLog(raw);
        expect(result.orderId).toBe('777');
        expect(result.count).toBe(2);
    });
});
