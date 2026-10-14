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

    const [totalOrders, totalUsers, totalActivities] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      ActivityLog.countDocuments(),
    ]);

    const siteObj = {
      _id: siteId || '65e0123456789abcdef00001',
      id: siteId || '65e0123456789abcdef00001',
      site_name: 'MediPulse Healthcare Portal',
      name: 'MediPulse Healthcare Portal',
      site_key: 'site_key_local_123',
      key: 'site_key_local_123',
      primary_domain: 'localhost',
      url: 'localhost',
      is_active: true,
      status: 'active',
      settings: {
        branding: {
          company_name: 'MediPulse Healthcare Ltd',
          logo: '',
          small_icon_url: '',
        },
      },
      shopify_config: {
        shop: 'medipulse-direct.myshopify.com',
      },
      allowed_product_filter: {
        product_ids: [],
      },
      metadata: {
        totalOrders,
        totalUsers,
        totalActivities,
      },
      totalOrders,
      totalUsers,
      totalActivities,
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { site: siteObj },
      site: siteObj,
      message: 'Site details fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching site details:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to fetch site details', data: null },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { siteId: id, ...body },
      message: 'Site updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to update site', data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { siteId: id },
      message: 'Site deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to delete site', data: null },
      { status: 500 }
    );
  }
}
