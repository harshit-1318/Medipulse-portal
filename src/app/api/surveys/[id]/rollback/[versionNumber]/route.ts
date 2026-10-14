import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string; versionNumber: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id, versionNumber } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    const vNum = parseInt(versionNumber, 10) || 1;
    const body = await request.json().catch(() => ({}));
    await connectToDatabase();

    const updated = await Survey.findByIdAndUpdate(
      id,
      {
        currentVersion: vNum,
        status: body.publishImmediately ? 'published' : 'draft',
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: updated,
      ...updated,
    });
  } catch (error: any) {
    console.error('Error in POST /api/surveys/[id]/rollback/[versionNumber]:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
