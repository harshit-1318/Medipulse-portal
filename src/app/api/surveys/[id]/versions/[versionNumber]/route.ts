import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string; versionNumber: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id, versionNumber } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    const vNum = parseInt(versionNumber, 10) || 1;
    await connectToDatabase();
    const survey = await Survey.findById(id).lean();
    if (!survey) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    const versionData = {
      _id: `${id}_v${vNum}`,
      surveyId: id,
      versionNumber: vNum,
      changelog: vNum === 1 ? 'Initial version' : `Version ${vNum} updates`,
      schema: survey.schema,
      publishedAt: new Date().toISOString(),
      publishedBy: { _id: 'u1', username: 'Super Admin' },
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: versionData,
      ...versionData,
    });
  } catch (error: any) {
    console.error('Error in GET /api/surveys/[id]/versions/[versionNumber]:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
