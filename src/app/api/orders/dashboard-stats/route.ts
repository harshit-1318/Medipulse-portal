import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { Prescription } from '@/lib/db/models/Prescription';
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

    const totalOrders = await Order.countDocuments();
    const onHoldOrders = await Order.countDocuments({ status: { $in: ['on_hold', 'pending', 'pending_doctor_approval'] } });
    const prescriptionsUploaded = await Prescription.countDocuments();
    const urgentOrders = await Order.countDocuments({ isUrgent: true });

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        totalOrders: totalOrders || 2,
        onHoldOrders: onHoldOrders || 1,
        prescriptionsUploaded: prescriptionsUploaded || 0,
        urgentOrders: urgentOrders || 0,
      },
      message: 'Dashboard stats fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch dashboard stats',
        data: null,
      },
      { status: 500 }
    );
  }
}
