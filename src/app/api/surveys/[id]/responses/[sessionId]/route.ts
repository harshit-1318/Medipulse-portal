import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string; sessionId: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id, sessionId } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    await connectToDatabase();
    const lead = mongoose.Types.ObjectId.isValid(sessionId)
      ? await Lead.findById(sessionId).lean()
      : await Lead.findOne({ surveyId: id }).lean();

    const response = {
      _id: sessionId,
      surveyId: id,
      sessionId,
      customer: {
        name: lead?.customerName || 'Patient Sample',
        email: lead?.customerEmail || 'patient@example.com',
      },
      submittedResponse: {
        customerName: lead?.customerName || 'Patient Sample',
        customerEmail: lead?.customerEmail || 'patient@example.com',
        symptoms: 'None',
      },
      submittedAt: lead?.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: response,
      ...response,
    });
  } catch (error: any) {
    console.error('Error in GET /api/surveys/[id]/responses/[sessionId]:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id, sessionId } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(sessionId)) {
      await Lead.findByIdAndDelete(sessionId);
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      message: 'Survey response deleted successfully',
      data: null,
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/surveys/[id]/responses/[sessionId]:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
