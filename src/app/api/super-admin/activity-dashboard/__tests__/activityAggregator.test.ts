import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aggregateActivityDashboard } from '../activityAggregator';
import { ActivityLog } from '@/lib/db/models/ActivityLog';

describe('aggregateActivityDashboard (src/app/api/super-admin/activity-dashboard/activityAggregator.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('aggregates live activity log metrics across the specified day range', async () => {
    vi.spyOn(ActivityLog, 'countDocuments').mockImplementation(((query: any) => {
      if (query?.action?.$in?.includes('customer_message_sent')) return 18;
      if (query?.action?.$in?.includes('login_failed')) return 0;
      if (query?.createdAt?.$lt) return 0;
      return 308;
    }) as any);

    vi.spyOn(ActivityLog, 'distinct').mockResolvedValue(['admin.vance@medipulse.io', 'dr.watson@medipulse.io'] as any);

    vi.spyOn(ActivityLog, 'aggregate').mockImplementation(((pipeline: any[]) => {
            if (pipeline[1]?.$group?._id?.['$dateToString']) {
        return [{ _id: '2026-10-15', count: 130 }];
      }
      if (pipeline[1]?.$group?._id === '$action') {
        return [
          { _id: 'login_success', count: 146 },
          { _id: 'order_status_changed', count: 15 },
        ];
      }
      if (pipeline[1]?.$group?._id === '$user_email') {
        return [{ _id: 'admin.vance@medipulse.io', count: 48 }];
      }
      return [];
    }) as any);

    vi.spyOn(ActivityLog, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([
            { user_email: 'admin.vance@medipulse.io', action: 'login_success', createdAt: new Date() },
          ]),
        }),
      }),
    } as any);

    const result = await aggregateActivityDashboard(30);

    expect(result.period.days).toBe(30);
    expect(result.totals.events).toBe(308);
    expect(result.totals.uniqueStaff).toBe(2);
    expect(result.totals.commActionsSent).toBe(18);
    expect(result.totals.failedLogins).toBe(0);
    expect(result.byDay.length).toBe(30);
    expect(result.byActionType.length).toBeGreaterThan(0);
    expect(result.topUsers[0].email).toBe('admin.vance@medipulse.io');
    expect(result.recentLogins.length).toBe(1);
  });

  it('handles empty database state gracefully without crashing', async () => {
    vi.spyOn(ActivityLog, 'countDocuments').mockResolvedValue(0 as any);
    vi.spyOn(ActivityLog, 'distinct').mockResolvedValue([] as any);
    vi.spyOn(ActivityLog, 'aggregate').mockResolvedValue([] as any);
    vi.spyOn(ActivityLog, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const result = await aggregateActivityDashboard(7);

    expect(result.period.days).toBe(7);
    expect(result.totals.events).toBe(0);
    expect(result.totals.uniqueStaff).toBe(0);
    expect(result.byDay.length).toBe(7);
    expect(result.byActionType.length).toBe(0);
    expect(result.topUsers.length).toBe(0);
    expect(result.recentLogins.length).toBe(0);
  });
});
