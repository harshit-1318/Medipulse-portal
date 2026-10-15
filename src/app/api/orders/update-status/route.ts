import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function POST(request: Request) {
  const auth = await verifyApiAuth(request, {
    requiredRoles: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'pharmacy_staff', 'customer_support', 'driver'],
  });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const orderId = String(body.order_id || body.orderId || body.id || '').trim();

    let updatedDoc: any = null;
    if (orderId) {
      await connectToDatabase();
      const cleanId = orderId.replace(/^#/, '');
      const query: Record<string, any> = {
        $or: [
          { orderNumber: orderId },
          { orderNumber: `#${cleanId}` },
          { orderNumber: cleanId },
          { shopify_order_id: cleanId },
          { shopify_order_id: String(cleanId) },
          { store_order_id: cleanId },
        ],
      };
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        query.$or.push({ _id: cleanId });
      }

      const updateFields: Record<string, any> = { updatedAt: new Date() };
      if (body.mark_on_hold === '1' || body.mark_on_hold === true || body.status === 'on_hold') {
        updateFields.status = 'on_hold';
        updateFields.fulfillment_status = 'on_hold';
      } else if (body.status) {
        updateFields.status = body.status;
        if (body.fulfillment_status || body.fulfillmentStatus) {
          updateFields.fulfillment_status = body.fulfillment_status || body.fulfillmentStatus;
        } else if (['completed', 'fulfilled', 'dispatched'].includes(String(body.status).toLowerCase())) {
          updateFields.fulfillment_status = 'fulfilled';
        } else if (['cancelled', 'voided'].includes(String(body.status).toLowerCase())) {
          updateFields.fulfillment_status = 'cancelled';
        }
      } else if (body.fulfillment_status || body.fulfillmentStatus) {
        updateFields.fulfillment_status = body.fulfillment_status || body.fulfillmentStatus;
      }

      if (body.make_unfulfilled === '1') {
        updateFields.fulfillment_status = 'unfulfilled';
      }

      updatedDoc = await Order.findOneAndUpdate(query, updateFields, { new: true }).lean();
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: updatedDoc || body,
      message: 'Order status updated successfully',
    });
  } catch (error: any) {
    console.error('Error in POST /api/orders/update-status:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message },
      { status: 500 }
    );
  }
}
