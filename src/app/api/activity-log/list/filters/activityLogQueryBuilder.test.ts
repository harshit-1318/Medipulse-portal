import { describe, it, expect } from 'vitest';
import { buildActivityLogQuery } from './activityLogQueryBuilder';

describe('buildActivityLogQuery', () => {
  it('handles empty parameters with default sorting', () => {
    const params = new URLSearchParams();
    const { query, sort } = buildActivityLogQuery(params);

    expect(query).toEqual({});
    expect(sort).toEqual({ createdAt: -1 });
  });

  it('builds role filter condition', () => {
    const params = new URLSearchParams('role=prescriber');
    const { query } = buildActivityLogQuery(params);

    expect(query).toEqual({
      $and: [
        { $or: [{ role: 'prescriber' }, { user_role: 'prescriber' }] },
      ],
    });
  });

  it('builds search filter condition across user name, email, and details', () => {
    const params = new URLSearchParams('search=Harshit');
    const { query } = buildActivityLogQuery(params);

    expect(query).toEqual({
      $and: [
        {
          $or: [
            { user: { $regex: 'Harshit', $options: 'i' } },
            { user_name: { $regex: 'Harshit', $options: 'i' } },
            { user_email: { $regex: 'Harshit', $options: 'i' } },
            { details: { $regex: 'Harshit', $options: 'i' } },
          ],
        },
      ],
    });
  });

  it('builds action filter condition', () => {
    const params = new URLSearchParams('action=login_success');
    const { query } = buildActivityLogQuery(params);

    expect(query).toEqual({
      $and: [
        { $or: [{ action: 'login_success' }, { action_type: 'login_success' }] },
      ],
    });
  });

  it('builds orderId filter condition', () => {
    const params = new URLSearchParams('orderId=MP-46287');
    const { query } = buildActivityLogQuery(params);

    expect(query).toEqual({
      $and: [
        {
          $or: [
            { orderId: { $regex: 'MP-46287', $options: 'i' } },
            { object_guid: { $regex: 'MP-46287', $options: 'i' } },
            { target_guid: { $regex: 'MP-46287', $options: 'i' } },
          ],
        },
      ],
    });
  });

  it('builds view (page scope) filter condition', () => {
    const params = new URLSearchParams('view=orders');
    const { query } = buildActivityLogQuery(params);

    expect(query).toEqual({
      $and: [
        { $or: [{ page: 'orders' }, { view: 'orders' }] },
      ],
    });
  });

  it('builds siteId filter condition', () => {
    const params = new URLSearchParams('siteId=site_123');
    const { query } = buildActivityLogQuery(params);

    expect(query).toEqual({
      $and: [
        { $or: [{ site_id: 'site_123' }, { siteName: 'site_123' }] },
      ],
    });
  });

  it('builds date range filter condition', () => {
    const params = new URLSearchParams('startDate=2026-09-01&endDate=2026-09-11');
    const { query } = buildActivityLogQuery(params);

    expect(query.$and).toBeDefined();
    const dateClause = query.$and?.find((c: any) => Boolean(c.createdAt));
    expect(dateClause).toBeDefined();
    expect(dateClause.createdAt.$gte).toBeInstanceOf(Date);
    expect(dateClause.createdAt.$lte).toBeInstanceOf(Date);
  });

  it('handles custom sortBy and sortDir', () => {
    const params = new URLSearchParams('sortBy=action&sortDir=asc');
    const { sort } = buildActivityLogQuery(params);

    expect(sort).toEqual({ action: 1 });
  });
});
