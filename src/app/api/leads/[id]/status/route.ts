import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Lead not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const newStatus = body.status;
    if (!newStatus) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Status is required' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Lead.findByIdAndUpdate(
      id,
      {
        status: newStatus,
        $push: { notes: { text: `Status updated to ${newStatus}`, createdAt: new Date() } },
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Lead not found' }, { status: 404 });
    }

    const payload = {
      status: updated.status,
      updatedAt: updated.updatedAt ? new Date(updated.updatedAt).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: payload,
      ...payload,
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/leads/[id]/status:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
