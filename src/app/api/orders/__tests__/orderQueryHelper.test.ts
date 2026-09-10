import { describe, it, expect } from 'vitest';
import { buildOrderQuery } from '../orderQueryHelper';

describe('buildOrderQuery', () => {
  it('returns default query and pagination when no params are provided', () => {
    const params = new URLSearchParams();
    const result = buildOrderQuery(params);

    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.sortOptions).toEqual({ createdAt: -1 });
    expect(result.query).toEqual({});
  });

  it('handles status, urgency, and parked filters', () => {
    const params = new URLSearchParams({
      status: 'completed',
      isUrgent: 'true',
      isParked: 'true',
    });
    const result = buildOrderQuery(params);

    expect(result.query.status).toBe('completed');
    expect(result.query.isUrgent).toBe(true);
    expect(result.query.isParked).toBe(true);
  });

  it('handles search by orderId and customer info', () => {
    const params = new URLSearchParams({
      orderId: '#MP-1024',
      customerName: 'John',
      customerEmail: 'john@example.com',
    });
    const result = buildOrderQuery(params);

    expect(result.query.orderNumber).toEqual({ $regex: 'MP-1024', $options: 'i' });
    expect(result.query.customerName).toEqual({ $regex: 'John', $options: 'i' });
    expect(result.query.customerEmail).toEqual({ $regex: 'john@example.com', $options: 'i' });
  });

  it('builds date range query correctly for given dates', () => {
    const params = new URLSearchParams({
      startDate: '2026-09-01',
      endDate: '2026-09-09',
    });
    const result = buildOrderQuery(params);

    expect(result.query.createdAt).toBeDefined();
    expect(result.query.createdAt.$gte).toBeInstanceOf(Date);
    expect(result.query.createdAt.$lte).toBeInstanceOf(Date);
    expect(result.query.createdAt.$gte.toISOString()).toContain('2026-09-01');
    expect(result.query.createdAt.$lte.toISOString()).toContain('2026-09-09');
  });

  it('handles custom pagination and sorting', () => {
    const params = new URLSearchParams({
      page: '3',
      limit: '50',
      sortBy: 'total',
      sort: 'asc',
    });
    const result = buildOrderQuery(params);

    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
    expect(result.sortOptions).toEqual({ total: 1 });
  });

  it('handles first and repeat order_type filtering', () => {
    const firstRes = buildOrderQuery(new URLSearchParams({ order_type: 'first' }));
    expect(firstRes.query.$or).toBeDefined();
    expect(firstRes.query.$or).toContainEqual({ order_type: 'first' });

    const repeatRes = buildOrderQuery(new URLSearchParams({ repeatedOrders: 'repeat' }));
    expect(repeatRes.query.$or).toBeDefined();
    expect(repeatRes.query.$or).toContainEqual({ order_type: 'repeat' });
  });

  it('handles on_hold, unfulfilled, fulfilled, cancelled fulfillmentStatus', () => {
    const holdRes = buildOrderQuery(new URLSearchParams({ fulfillmentStatus: 'on_hold' }));
    expect(holdRes.query.$or).toContainEqual({ status: { $in: ['on_hold', 'hold'] } });

    const unfulfilledRes = buildOrderQuery(new URLSearchParams({ fulfillmentStatus: 'unfulfilled' }));
    expect(unfulfilledRes.query.$or).toContainEqual({ fulfillment_status: 'unfulfilled' });

    const fulfilledRes = buildOrderQuery(new URLSearchParams({ fulfillmentStatus: 'fulfilled' }));
    expect(fulfilledRes.query.$or).toContainEqual({ fulfillment_status: 'fulfilled' });

    const cancelledRes = buildOrderQuery(new URLSearchParams({ fulfillmentStatus: 'cancelled' }));
    expect(cancelledRes.query.$or).toContainEqual({ fulfillment_status: 'cancelled' });
  });

  it('combines order_type and status using $and', () => {
    const res = buildOrderQuery(new URLSearchParams({ order_type: 'first', fulfillmentStatus: 'on_hold' }));
    expect(res.query.$and).toBeDefined();
    expect(res.query.$and.length).toBe(2);
  });
});
