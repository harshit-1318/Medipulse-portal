import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { User } from '@/lib/db/models/User';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        totalSites: 1,
        activeSites: 1,
        totalUsers: totalUsers || 12,
        totalActivities: totalOrders + totalUsers || 348,
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
