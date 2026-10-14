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
    const source = await Survey.findById(id).lean();

    if (!source) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Survey not found' }, { status: 404 });
    }

    const newTitle = body.title || `Copy of ${source.title}`;
    const slug = `${source.slug || 'survey'}-copy-${Date.now().toString(36)}`;

    const duplicated = await Survey.create({
      siteId: source.siteId,
      title: newTitle,
      description: source.description,
      slug,
      status: 'draft',
      currentVersion: 1,
      schema: source.schema,
      settings: source.settings,
    });

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: duplicated,
      ...duplicated.toObject(),
    });
  } catch (error: any) {
    console.error('Error in POST /api/surveys/[id]/duplicate:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
