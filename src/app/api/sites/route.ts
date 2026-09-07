import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { User } from '@/lib/db/models/User';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const sampleSites = [
      {
        _id: '65e0123456789abcdef00001',
        id: '65e0123456789abcdef00001',
        name: 'MediPulse Healthcare Portal',
        site_name: 'MediPulse Healthcare Portal',
        key: 'site_key_local_123',
        site_key: 'site_key_local_123',
        primary_domain: 'localhost',
        url: 'localhost',
        is_active: true,
        totalUsers: totalUsers || 12,
        totalOrders: totalOrders || 2,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        sites: sampleSites,
        total: sampleSites.length,
        page: 1,
        pageSize: 10,
      },
      message: 'Sites fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch sites',
        data: {
          sites: [],
          total: 0,
          page: 1,
          pageSize: 10,
        },
      },
      { status: 500 }
    );
  }
}
