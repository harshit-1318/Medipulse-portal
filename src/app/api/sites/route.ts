import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { User } from '@/lib/db/models/User';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

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
        totalUsers: totalUsers ?? 0,
        totalOrders: totalOrders ?? 0,
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

export async function POST(request: Request) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const newSite = {
      _id: `site_${Date.now()}`,
      id: `site_${Date.now()}`,
      name: body.name || body.site_name || 'New Site',
      site_name: body.site_name || body.name || 'New Site',
      key: body.key || body.site_key || `site_key_${Date.now()}`,
      site_key: body.site_key || body.key || `site_key_${Date.now()}`,
      primary_domain: body.primary_domain || body.url || 'localhost',
      url: body.url || body.primary_domain || 'localhost',
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      totalUsers: 0,
      totalOrders: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: newSite,
      site: newSite,
      message: 'Site created successfully',
    });
  } catch (error: any) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to create site', data: null },
      { status: 500 }
    );
  }
}
