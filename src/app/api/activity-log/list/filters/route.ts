import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const sampleLogs = [
      {
        _id: 'act_101',
        action: 'user_login',
        action_type: 'USER_LOGIN',
        user: 'Admin Harshit',
        user_name: 'Admin Harshit',
        user_email: 'admin@medipulse.io',
        details: 'User logged in successfully',
        site_id: '65e0123456789abcdef00001',
        siteName: 'MediPulse Healthcare Portal',
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      },
      {
        _id: 'act_102',
        action: 'order_viewed',
        action_type: 'ORDER_VIEWED',
        user: 'Admin Harshit',
        user_name: 'Admin Harshit',
        user_email: 'admin@medipulse.io',
        details: 'Viewed order #10042',
        site_id: '65e0123456789abcdef00001',
        siteName: 'MediPulse Healthcare Portal',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        logs: sampleLogs,
        total: sampleLogs.length,
        page: 1,
        limit: 20,
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
