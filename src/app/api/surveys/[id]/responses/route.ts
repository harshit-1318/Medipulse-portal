import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;

    const sampleResponses = [
      {
        _id: 'resp_1',
        sessionId: 'sess_101',
        surveyId: id,
        customerName: 'Oliver Smith',
        customerEmail: 'oliver.smith@example.com',
        status: 'completed',
        answers: { bmi: '26.4', medical_conditions: 'No' },
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        items: sampleResponses,
        total: sampleResponses.length,
        page,
        pageSize: limit,
      },
      items: sampleResponses,
      total: sampleResponses.length,
      page,
      pageSize: limit,
      message: 'Survey responses fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching survey responses:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to fetch responses', data: null },
      { status: 500 }
    );
  }
}
