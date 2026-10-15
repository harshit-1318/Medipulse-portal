import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { Customer } from '@/lib/db/models/Customer';
import { Survey } from '@/lib/db/models/Survey';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    await connectToDatabase();

    const [totalOrders, totalCustomers, totalSurveys, pendingApprovals, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Customer.countDocuments(),
      Survey.countDocuments(),
      Order.countDocuments({
        $or: [
          { status: { $regex: /pending/i } },
          { status: 'pending_doctor_approval' },
        ],
      }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);

    const monthlyRevenue = Number(revenueAgg[0]?.total ?? 0);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        totalOrders: totalOrders ?? 0,
        totalCustomers: totalCustomers ?? 0,
        totalSurveys: totalSurveys ?? 0,
        pendingApprovals: pendingApprovals ?? 0,
        monthlyRevenue: monthlyRevenue ?? 0,
      },
      message: 'Dashboard stats calculated from MongoDB Atlas',
    });
  } catch (error: any) {
    console.error('Error in GET /api/dashboard/stats:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message, data: null },
      { status: 500 }
    );
  }
}

