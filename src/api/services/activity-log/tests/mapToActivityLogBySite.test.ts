import { describe, it, expect } from 'vitest';
import { mapToActivityLogBySite } from '../mappers';

describe('mapToActivityLogBySite', () => {
    it('maps raw log and reads orderId from object_guid', () => {
        const raw = {
            _id: 'id_s1',
            action_type: 'order_created',
            view: 'orders',
            user_email: 'jane@clinic.com',
            user_name: 'Jane',
            object_guid: '4321',
            details: 'Order created',
            createdAt: '2026-04-23T09:00:00Z',
        };

        const result = mapToActivityLogBySite(raw);

        expect(result).toMatchObject({
            id: 'id_s1',
            action: 'order_created',
            page: 'orders',
            userEmail: 'jane@clinic.com',
            userName: 'Jane',
            orderId: '4321',
        });
    });

    it('falls back to email prefix when user_name is empty', () => {
        const raw = {
            _id: 'id_s2',
            action_type: 'login_success',
            view: 'auth',
            user_email: 'tom@test.com',
            user_name: '',
            object_guid: '',
            createdAt: '2026-04-23T09:00:00Z',
        };

        const result = mapToActivityLogBySite(raw);

        expect(result.userName).toBe('tom');
    });
});
