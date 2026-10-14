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

    await connectToDatabase();
    const leads = await Lead.find({ surveyId: id }).lean();

    const headers = 'Response ID,Customer Name,Customer Email,Status,Submitted At\n';
    const rows = leads.map((l: any) =>
      `"${l._id}","${l.customerName || ''}","${l.customerEmail || ''}","${l.status || ''}","${l.createdAt || ''}"`
    ).join('\n');

    const csv = `${headers}${rows}`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="survey-${id}-responses.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/surveys/[id]/responses/export:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
