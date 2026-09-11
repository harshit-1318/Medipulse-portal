import { connectToDatabase } from './mongodb';
import { ActivityLog, type IActivityLog } from './models/ActivityLog';

export async function recordActivity(data: Partial<IActivityLog>): Promise<void> {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return;
  }

  try {
    await connectToDatabase();

    const email = (data.user_email || '').trim().toLowerCase();
    const action = data.action || data.action_type || 'activity';

    // Duplicate prevention: avoid inserting duplicate consecutive events for same user/action within 10 seconds
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const recentDuplicate = await ActivityLog.findOne({
      user_email: email,
      action,
      createdAt: { $gte: tenSecondsAgo },
    });

    if (recentDuplicate) {
      return;
    }

    await ActivityLog.create({
      ...data,
      action,
      action_type: data.action_type || action,
      user_email: email,
      createdAt: data.createdAt || new Date(),
    });
  } catch (error) {
    console.error('❌ [recordActivity] Failed to persist activity log:', error);
  }
}
