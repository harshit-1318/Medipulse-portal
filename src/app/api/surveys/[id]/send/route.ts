import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    await connectToDatabase();
    const survey = await Survey.findById(id).lean();

    if (!survey) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    const token = `surv_${id.slice(-6)}_${Date.now().toString(36)}`;
    const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
    const payload = {
      sessionId: `sess_${token}`,
      token,
      surveyLink: `/s/${token}`,
      expiresAt,
      customerEmail: body.customerEmail || 'patient@example.com',
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      ...payload,
      data: payload,
    });
  } catch (error: any) {
    console.error('Error in POST /api/surveys/[id]/send:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
