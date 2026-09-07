import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, {
    requiredRoles: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'pharmacy_staff', 'customer_support', 'driver'],
  });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    await connectToDatabase();

    let orders = await Order.find().limit(50).lean();

    if (orders.length === 0) {
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
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        orders,
        total: orders.length,
        page: 1,
        limit: 50,
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
