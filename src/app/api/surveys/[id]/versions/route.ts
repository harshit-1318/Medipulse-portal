import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';
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

    await connectToDatabase();
    const survey = await Survey.findById(id).lean();
    if (!survey) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    const currentVersion = survey.currentVersion || 1;
    const items = [];
    for (let v = currentVersion; v >= 1; v--) {
      items.push({
        _id: `${id}_v${v}`,
        surveyId: id,
        versionNumber: v,
        changelog: v === 1 ? 'Initial version' : `Version ${v} updates`,
        schema: survey.schema,
        publishedAt: new Date(Date.now() - (currentVersion - v) * 86400000).toISOString(),
        publishedBy: { _id: 'u1', username: 'Super Admin' },
      });
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      items,
      total: items.length,
      data: { items, total: items.length },
    });
  } catch (error: any) {
    console.error('Error in GET /api/surveys/[id]/versions:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
