import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { verifyApiAuth } from '@/lib/auth/apiAuth';
import { buildOrderDetailPayload } from './helpers';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const auth = await verifyApiAuth(request, {
    requiredRoles: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'pharmacy_staff', 'customer_support', 'driver'],
  });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id || '').trim();

    await connectToDatabase();

    const isMongoId = mongoose.Types.ObjectId.isValid(cleanId);
    const orderDoc = await Order.findOne({
      $or: [
        { shopify_order_id: cleanId },
        { orderNumber: cleanId },
        { orderNumber: `#${cleanId}` },
        { store_order_id: cleanId },
        ...(isMongoId ? [{ _id: cleanId }] : []),
      ],
    }).lean();

    if (!orderDoc) {
      return NextResponse.json(
        {
          status: 'ERROR',
          success: false,
          message: 'Order not found',
          data: null,
        },
        { status: 404 }
      );
    }

    const orderData = buildOrderDetailPayload(orderDoc, cleanId);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: orderData,
      message: 'Order retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch order details',
        data: null,
      },
      { status: 500 }
    );
  }
}
