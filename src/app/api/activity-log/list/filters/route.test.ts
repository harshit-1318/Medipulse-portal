import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/activity-log/list/filters - Comprehensive Filter Cross-Check', () => {
  it('1. Returns default un-filtered logs with pagination metadata', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?page=1&limit=10');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.page).toBe(1);
    expect(json.data.limit).toBe(10);
    expect(json.data.total).toBeGreaterThan(0);
    expect(json.data.logs.length).toBeLessThanOrEqual(10);
  });

  it('2. Filters by Role (role=prescriber)', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?role=prescriber&limit=20');
    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.logs.length).toBeGreaterThan(0);
    for (const log of json.data.logs) {
      const role = (log.role || log.user_role || '').toLowerCase();
      expect(role).toBe('prescriber');
    }
  });

  it('3. Filters by Role (role=super_admin)', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?role=super_admin&limit=20');
    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    for (const log of json.data.logs) {
      const role = (log.role || log.user_role || '').toLowerCase();
      expect(role).toBe('super_admin');
    }
  });

  it('4. Filters by Search query across user and email (search=watson)', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?search=watson&limit=20');
    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.logs.length).toBeGreaterThan(0);
    for (const log of json.data.logs) {
      const text = `${log.user || ''} ${log.user_name || ''} ${log.user_email || ''} ${log.details || ''}`.toLowerCase();
      expect(text).toContain('watson');
    }
  });

  it('5. Filters by Action type (action=login_success)', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?action=login_success&limit=20');
    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.logs.length).toBeGreaterThan(0);
    for (const log of json.data.logs) {
      const action = (log.action || log.action_type || '').toLowerCase();
      expect(action).toBe('login_success');
    }
  });

  it('6. Filters by Order ID (orderId=MP-46287)', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?orderId=MP-46287&limit=20');
    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.logs.length).toBeGreaterThan(0);
    for (const log of json.data.logs) {
      const id = log.orderId || log.object_guid || log.target_guid;
      expect(id).toContain('MP-46287');
    }
  });

  it('7. Filters by Page Scope (view=orders)', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?view=orders&limit=20');
    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.logs.length).toBeGreaterThan(0);
    for (const log of json.data.logs) {
      const view = (log.page || log.view || '').toLowerCase();
      expect(view).toBe('orders');
    }
  });

  it('8. Filters by Date Range (startDate and endDate)', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?startDate=2026-09-01&endDate=2026-09-11&limit=20');
    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    for (const log of json.data.logs) {
      const logDate = new Date(log.createdAt);
      expect(logDate.getTime()).toBeGreaterThanOrEqual(new Date('2026-09-01T00:00:00.000Z').getTime());
      expect(logDate.getTime()).toBeLessThanOrEqual(new Date('2026-09-11T23:59:59.999Z').getTime());
    }
  });

  it('9. Handles custom sorting (sortBy=action&sortDir=asc)', async () => {
    const req = new Request('http://localhost:3000/api/activity-log/list/filters?sortBy=action&sortDir=asc&limit=5');
    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.logs.length).toBeGreaterThan(0);
  });
});
