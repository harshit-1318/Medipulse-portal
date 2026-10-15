import { NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, { requiredRoles: ['super_admin', 'admin'] });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') || 25);

    const sampleJobs = [
      {
        id: 'job_1',
        jobKey: 'rem_1001_first',
        siteId: '65e0123456789abcdef00001',
        orderId: 1001,
        reminderType: 'first',
        status: 'completed',
        attempts: 1,
        availableAt: new Date(Date.now() - 3600000).toISOString(),
        startedAt: new Date(Date.now() - 3590000).toISOString(),
        processedAt: new Date(Date.now() - 3580000).toISOString(),
        lastError: null,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 3580000).toISOString(),
      },
      {
        id: 'job_2',
        jobKey: 'rem_1002_oops',
        siteId: '65e0123456789abcdef00001',
        orderId: 1002,
        reminderType: 'oops',
        status: 'pending',
        attempts: 0,
        availableAt: new Date(Date.now() + 1800000).toISOString(),
        startedAt: null,
        processedAt: null,
        lastError: null,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ];

    const data = {
      summary: {
        pending: 1,
        processing: 0,
        completed: 1,
        failed: 0,
        total: 2,
        duePending: 0,
        retryPending: 0,
      },
      jobs: sampleJobs.slice(0, limit),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in GET /api/email/queue/overview:', error);
    return NextResponse.json(
      {
        summary: {
          pending: 0,
          processing: 0,
          completed: 0,
          failed: 0,
          total: 0,
          duePending: 0,
          retryPending: 0,
        },
        jobs: [],
        generatedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
