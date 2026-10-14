import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    await connectToDatabase();
    const leads = await Lead.find({ surveyId: id }).limit(limit).lean();

    const items = leads.map((lead: any, idx: number) => ({
      _id: lead._id.toString(),
      surveyId: id,
      customerId: lead.customerId || `cust_${idx + 1}`,
      customer: {
        name: lead.customerName || 'Patient',
        email: lead.customerEmail || 'patient@example.com',
      },
      status: lead.status === 'qualified' ? 'completed' : 'pending',
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: lead.createdAt || new Date().toISOString(),
      updatedAt: lead.updatedAt || new Date().toISOString(),
    }));

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      items,
      total: items.length,
      page,
      limit,
      data: { items, total: items.length, page, limit },
    });
  } catch (error: any) {
    console.error('Error in GET /api/surveys/[id]/sessions:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
