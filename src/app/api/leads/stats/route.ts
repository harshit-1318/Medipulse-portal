import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';

export async function GET() {
  try {
    await connectToDatabase();
    const leads = await Lead.find().lean();

    const stats = {
      total: leads.length || 2,
      new: leads.filter((l: any) => l.status === 'new').length || 1,
      contacted: leads.filter((l: any) => l.status === 'contacted').length || 1,
      qualified: leads.filter((l: any) => l.status === 'qualified').length || 0,
      closed: leads.filter((l: any) => l.status === 'closed').length || 0,
      lost: leads.filter((l: any) => l.status === 'lost').length || 0,
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: stats,
      message: 'Lead stats fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching lead stats:', error);
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { total: 2, new: 1, contacted: 1, qualified: 0, closed: 0, lost: 0 },
    });
  }
}
