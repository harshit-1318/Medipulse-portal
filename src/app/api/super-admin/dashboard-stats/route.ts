import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { ActivityLog } from '@/lib/db/models/ActivityLog';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    await connectToDatabase();

    const [totalUsers, totalActivities] = await Promise.all([
      User.countDocuments(),
      ActivityLog.countDocuments(),
    ]);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        totalSites: 1,
        activeSites: 1,
        totalUsers: totalUsers ?? 0,
        totalActivities: totalActivities ?? 0,
      },
      message: 'Super admin dashboard stats fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching super admin stats:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch super admin stats',
        data: {
          totalSites: 0,
          activeSites: 0,
          totalUsers: 0,
          totalActivities: 0,
        },
      },
      { status: 500 }
    );
  }
}
