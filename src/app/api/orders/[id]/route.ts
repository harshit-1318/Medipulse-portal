import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { buildOrderDetailPayload } from './helpers';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
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
        ...(isMongoId ? [{ _id: cleanId }] : []),
      ],
    }).lean();

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
