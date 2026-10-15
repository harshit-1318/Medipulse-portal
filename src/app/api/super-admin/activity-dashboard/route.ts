import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyApiAuth } from '@/lib/auth/apiAuth';
import { aggregateActivityDashboard } from './activityAggregator';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const daysParam = parseInt(searchParams.get('days') || '30', 10);
    const days = Math.min(365, Math.max(1, isNaN(daysParam) ? 30 : daysParam));

    const dashboardData = await aggregateActivityDashboard(days);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: dashboardData,
      message: 'Super admin activity dashboard fetched from MongoDB',
    });
  } catch (error: any) {
    console.error('Error in GET /api/super-admin/activity-dashboard:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to fetch activity dashboard', data: null },
      { status: 500 }
    );
  }
}
