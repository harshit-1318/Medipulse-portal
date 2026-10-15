import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';
import { Lead } from '@/lib/db/models/Lead';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, { requiredRoles: ['super_admin', 'admin'] });
  if (!auth.authorized) return auth.errorResponse!;

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
