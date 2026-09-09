import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { verifyApiAuth } from '@/lib/auth/apiAuth';
import { buildOrderQuery } from './orderQueryHelper';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, {
    requiredRoles: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'pharmacy_staff', 'customer_support', 'driver'],
  });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const { query, sortOptions, page, limit } = buildOrderQuery(searchParams);

    await connectToDatabase();

    let total = await Order.countDocuments(query);
    let orders = await Order.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (total === 0 && Object.keys(query).length === 0) {
      const sampleOrders = await Order.insertMany([
        {
          orderNumber: 'MP-1001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          status: 'completed',
          total: 89.99,
          items: [{ name: 'Semaglutide 0.25mg Pen', quantity: 1, price: 89.99 }],
        },
        {
          orderNumber: 'MP-1002',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          status: 'pending_doctor_approval',
          total: 120.0,
          items: [{ name: 'Tirzepatide 2.5mg Pen', quantity: 1, price: 120.0 }],
        },
      ]);
      orders = sampleOrders.map((o) => o.toObject());
      total = orders.length;
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        orders,
        total,
        page,
        limit,
      },
      message: 'Orders fetched from MongoDB Atlas successfully',
    });
  } catch (error: any) {
    console.error('Error fetching orders from MongoDB:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch orders',
        data: null,
      },
      { status: 500 }
    );
  }
}
