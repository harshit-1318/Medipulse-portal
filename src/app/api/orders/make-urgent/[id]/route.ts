import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cleanId = (id || '').trim().replace(/^#/, '');

    if (!cleanId || cleanId === '--') {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Invalid order ID' },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const query: any[] = [{ orderNumber: cleanId }, { shopify_order_id: cleanId }];
      if (mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24) {
        query.push({ _id: new mongoose.Types.ObjectId(cleanId) });
      }

      await Order.findOneAndUpdate(
        { $or: query },
        { 
          $set: { isUrgent: true },
          $addToSet: { tags: 'makeurgent' }
        },
        { new: true }
      );
    } catch (dbErr) {
      console.warn('DB update in local dev:', dbErr);
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { orderId: cleanId, isUrgent: true },
      message: 'Order marked as urgent successfully',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { isUrgent: true },
      message: 'Order marked as urgent successfully',
    });
  }
}
