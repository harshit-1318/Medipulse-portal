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

    expect(result.query.$and.some((c: any) => c.status === 'completed')).toBe(true);
    expect(result.query.$and.some((c: any) => c.$or?.some((o: any) => o.isUrgent === true))).toBe(true);
    expect(result.query.$and.some((c: any) => c.$or?.some((o: any) => o.isParked === true))).toBe(true);
  });

  it('handles search by orderId and customer info', () => {
    const params = new URLSearchParams({
      orderId: '#MP-1024',
      customerName: 'John',
      customerEmail: 'john@example.com',
    });
    const result = buildOrderQuery(params);

    expect(result.query.customerName).toEqual({ $regex: 'John', $options: 'i' });
    expect(result.query.customerEmail).toEqual({ $regex: 'john@example.com', $options: 'i' });
    expect(result.query.$and).toBeDefined();
    expect(result.query.$and.some((c: any) => c.$or?.some((o: any) => o.orderNumber?.$regex?.includes('1024')))).toBe(true);
  });

  it('handles customerId search', () => {
    const params = new URLSearchParams({ customerId: '650375' });
    const result = buildOrderQuery(params);

    expect(result.query.$and).toBeDefined();
    expect(result.query.$and.some((c: any) => c.$or?.some((o: any) => o.store_order_id?.$regex === '650375'))).toBe(true);
  });

  it('builds date range query correctly for given dates (both camelCase and snake_case)', () => {
    const params = new URLSearchParams({
      start_date: '2026-09-01T00:00:00.000Z',
      end_date: '2026-09-09T23:59:59.999Z',
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
    expect(firstRes.query.$and).toBeDefined();
    expect(firstRes.query.$and.some((c: any) => c.$or?.some((o: any) => o.order_type === 'first'))).toBe(true);

    const repeatRes = buildOrderQuery(new URLSearchParams({ repeatedOrders: 'repeat' }));
    expect(repeatRes.query.$and).toBeDefined();
    expect(repeatRes.query.$and.some((c: any) => c.$or?.some((o: any) => o.order_type === 'repeat'))).toBe(true);
  });

  it('handles product_type filter (injectable and oral)', () => {
    const injRes = buildOrderQuery(new URLSearchParams({ product_type: 'injectable' }));
    expect(injRes.query.$and).toBeDefined();
    expect(injRes.query.$and.some((c: any) => c['items.name']?.$regex?.includes('inject'))).toBe(true);

    const oralRes = buildOrderQuery(new URLSearchParams({ products: 'oral' }));
    expect(oralRes.query.$and).toBeDefined();
    expect(oralRes.query.$and.some((c: any) => c['items.name']?.$regex?.includes('oral'))).toBe(true);
  });

  it('handles product category and product name filters', () => {
    const catRes = buildOrderQuery(new URLSearchParams({ product_category: 'weight-loss', productName: 'Wegovy' }));
    expect(catRes.query.$and).toBeDefined();
    expect(catRes.query.$and.some((c: any) => c.$or?.some((o: any) => o.tags?.$regex === 'weight-loss'))).toBe(true);
    expect(catRes.query.$and.some((c: any) => c.$or?.some((o: any) => o['items.name']?.$regex === 'Wegovy'))).toBe(true);
  });

  it('handles documents filter (uploaded and not_uploaded)', () => {
    const upRes = buildOrderQuery(new URLSearchParams({ documentStatus: 'uploaded' }));
    expect(upRes.query.$and).toBeDefined();
    expect(upRes.query.$and.some((c: any) => c.$or?.some((o: any) => o.hasIdCard === true))).toBe(true);

    const notUpRes = buildOrderQuery(new URLSearchParams({ documentStatus: 'not_uploaded' }));
    expect(notUpRes.query.$and).toBeDefined();
    expect(notUpRes.query.$and.some((c: any) => c.hasIdCard?.$ne === true)).toBe(true);
  });

  it('handles on_hold, unfulfilled, fulfilled, cancelled fulfillmentStatus', () => {
    const getClauses = (res: any) => res.query.$or || (res.query.$and ? res.query.$and[0]?.$or : []);

    const holdRes = buildOrderQuery(new URLSearchParams({ fulfillmentStatus: 'on_hold' }));
    expect(getClauses(holdRes)).toContainEqual({ status: { $in: ['on_hold', 'hold'] } });

    const unfulfilledRes = buildOrderQuery(new URLSearchParams({ fulfillmentStatus: 'unfulfilled' }));
    expect(getClauses(unfulfilledRes)).toContainEqual({ fulfillment_status: 'unfulfilled' });

    const fulfilledRes = buildOrderQuery(new URLSearchParams({ fulfillmentStatus: 'fulfilled' }));
    expect(getClauses(fulfilledRes)).toContainEqual({ fulfillment_status: 'fulfilled' });

    const cancelledRes = buildOrderQuery(new URLSearchParams({ fulfillmentStatus: 'cancelled' }));
    expect(getClauses(cancelledRes)).toContainEqual({ fulfillment_status: 'cancelled' });
  });

  it('combines multiple filters using $and without clashing', () => {
    const res = buildOrderQuery(new URLSearchParams({
      order_type: 'first',
      fulfillmentStatus: 'on_hold',
      product_type: 'injectable',
      isUrgent: 'true',
    }));
    expect(res.query.$and).toBeDefined();
    expect(res.query.$and.length).toBeGreaterThanOrEqual(3);
  });

  it('ignores case-insensitive "ALL" status and category filters', () => {
    const res = buildOrderQuery(new URLSearchParams({
      status: 'ALL',
      fulfillmentStatus: 'All',
      product_category: 'ALL',
      product_type: 'ALL',
      documentStatus: 'ALL',
    }));
    expect(res.query).toEqual({});
  });
});
