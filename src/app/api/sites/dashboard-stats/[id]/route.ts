import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { User } from '@/lib/db/models/User';
import { ActivityLog } from '@/lib/db/models/ActivityLog';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const siteId = decodeURIComponent(id || '').trim();

    await connectToDatabase();

    const [totalOrders, totalUsers, totalActivities, recentOrders, recentActivities] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      ActivityLog.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      ActivityLog.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const siteObj = {
      _id: siteId || '65e0123456789abcdef00001',
      id: siteId || '65e0123456789abcdef00001',
      name: 'MediPulse Healthcare Portal',
      key: 'site_key_local_123',
      primary_domain: 'localhost',
      is_active: true,
    };

    const responseData = {
      site: siteObj,
      stats: {
        users: totalUsers,
        orders: totalOrders,
        activities: totalActivities,
        customers: totalUsers,
      },
      recentOrders,
      recentActivities,
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: responseData,
      ...responseData,
      message: 'Dashboard stats fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching site dashboard stats:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to fetch stats', data: null },
      { status: 500 }
    );
  }
}
