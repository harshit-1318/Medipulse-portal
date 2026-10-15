import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, {
    requiredRoles: ['super_admin', 'admin', 'customer_support'],
  });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    await connectToDatabase();
    const leads = await Lead.find().lean();

    const stats = {
      total: leads.length,
      new: leads.filter((l: any) => l.status === 'new').length,
      contacted: leads.filter((l: any) => l.status === 'contacted').length,
      qualified: leads.filter((l: any) => l.status === 'qualified').length,
      closed: leads.filter((l: any) => l.status === 'closed').length,
      lost: leads.filter((l: any) => l.status === 'lost').length,
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: stats,
      message: 'Lead stats fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching lead stats:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch lead stats',
        data: null,
      },
      { status: 500 }
    );
  }
}

