import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ActivityLog } from '@/lib/db/models/ActivityLog';
import { buildActivityLogQuery } from './activityLogQueryBuilder';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Clean up any legacy dummy placeholder logs
    await ActivityLog.deleteMany({ _id: { $regex: /^act_/ } }).catch(() => {});

    // Ensure currently active authenticated session is logged if missing
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader
        .split(';')
        .map((c) => c.trim().split('='))
        .filter(([k]) => Boolean(k))
        .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
    );
    const activeUser = cookies.username;
    const activeRole = cookies.role || 'user';
    if (activeUser) {
      const activeEmail =
        activeRole === 'super_admin'
          ? 'kumarharshit370@gmail.com'
          : `${activeUser.toLowerCase().replace(/\s+/g, '.')}@medipulse.io`;
      const hasRecentLogin = await ActivityLog.findOne({ user_email: activeEmail, action: 'login_success' });
      if (!hasRecentLogin) {
        await ActivityLog.create({
          action: 'login_success',
          action_type: 'login_success',
          user: activeUser,
          user_name: activeUser,
          user_email: activeEmail,
          role: activeRole,
          user_role: activeRole,
          details: `${activeUser} (${activeRole}) logged in to healthcare portal`,
          page: 'auth',
          view: 'auth',
          createdAt: new Date(),
        });
      }
    }

    const { searchParams } = new URL(request.url);
    const pageParam = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limitParam = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));

    const { query, sort } = buildActivityLogQuery(searchParams);

    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .sort(sort)
      .skip((pageParam - 1) * limitParam)
      .limit(limitParam)
      .lean();

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        logs,
        total,
        page: pageParam,
        limit: limitParam,
      },
      message: 'Activity logs fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch activity logs',
        data: {
          logs: [],
          total: 0,
          page: 1,
          limit: 20,
        },
      },
      { status: 500 }
    );
  }
}
