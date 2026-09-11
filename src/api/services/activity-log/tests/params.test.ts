import { describe, it, expect } from 'vitest';
import { buildActivityLogParams } from '../params';

describe('buildActivityLogParams', () => {
    it('always includes group=true', () => {
        const params = buildActivityLogParams(1, 20, {});
        expect(params.group).toBe('true');
    });

    it('defaults sort to desc', () => {
        const params = buildActivityLogParams(1, 20, {});
        expect(params.sort).toBe('desc');
    });

    it('maps page and limit correctly', () => {
        const params = buildActivityLogParams(3, 50, {});
        expect(params.page).toBe(3);
        expect(params.limit).toBe(50);
    });

    it('maps sortBy through sortMapping (page → view)', () => {
        const params = buildActivityLogParams(1, 20, { sortBy: 'page' });
        expect(params.sortBy).toBe('view');
    });

    it('maps selected site filter to both siteId and site_guid params', () => {
        const params = buildActivityLogParams(1, 20, { siteId: 'site_123' });
        expect(params.siteId).toBe('site_123');
        expect(params.site_guid).toBe('site_123');
    });

    it('passes search, action, orderId through when set', () => {
        const params = buildActivityLogParams(1, 20, {
            search: 'john',
            action: 'order_viewed',
            orderId: '9999',
        });
        expect(params.search).toBe('john');
        expect(params.action).toBe('order_viewed');
        expect(params.orderId).toBe('9999');
    });

    it('maps view filter to pageName', () => {
        const params = buildActivityLogParams(1, 20, { view: 'orders' });
        expect(params.pageName).toBe('orders');
    });

    it('omits search when not provided', () => {
        const params = buildActivityLogParams(1, 20, {});
        expect(params.search).toBeUndefined();
    });

    it('passes role through when provided', () => {
        const params = buildActivityLogParams(1, 20, { role: 'prescriber' });
        expect(params.role).toBe('prescriber');
    });
});
