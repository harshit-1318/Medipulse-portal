import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';
import { Lead } from '@/lib/db/models/Lead';

export async function GET() {
  try {
    await connectToDatabase();

    const [totalSurveys, publishedSurveys, draftSurveys, totalLeads] = await Promise.all([
      Survey.countDocuments(),
      Survey.countDocuments({ status: 'published' }),
      Survey.countDocuments({ status: 'draft' }),
      Lead.countDocuments().catch(() => 0),
    ]);

    const stats = {
      totalSurveys,
      draftSurveys,
      publishedSurveys,
      totalSessions: 0,
      completedSessions: 0,
      pendingSessions: 0,
      expiredSessions: 0,
      totalLeads,
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: stats,
      message: 'Survey stats fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching survey stats:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch survey stats',
        data: null,
      },
      { status: 500 }
    );
  }
}
