import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderId = String(body.orderId || body.id || '').trim();

    if (!orderId) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanId = orderId.replace(/^#/, '');

    const query: Record<string, any> = {
      $or: [
        { orderNumber: orderId },
        { orderNumber: `#${cleanId}` },
        { orderNumber: cleanId },
        { shopify_order_id: cleanId },
        { shopify_order_id: String(cleanId) },
        { shopify_order_id: Number(cleanId) || 0 },
        { store_order_id: cleanId },
      ],
    };

    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      query.$or.push({ _id: cleanId });
    }

    const updated = await Order.findOneAndUpdate(
      query,
      {
        status: 'cancelled',
        fulfillment_status: 'cancelled',
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      message: 'Order cancelled successfully',
      data: updated || { orderId, status: 'cancelled' },
    });
  } catch (error: any) {
    console.error('Error in POST /api/orders/cancel:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message },
      { status: 500 }
    );
  }
}
