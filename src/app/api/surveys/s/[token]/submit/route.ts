import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { token } = await params;
    const body = await request.json().catch(() => ({}));
    const submittedResponse = body.submittedResponse || {};

    const name = submittedResponse.customerName || submittedResponse.name || 'Survey Participant';
    const email = submittedResponse.customerEmail || submittedResponse.email;

    if (email) {
      await connectToDatabase();
      await Lead.create({
        customerName: name,
        customerEmail: email,
        status: 'new',
        surveyId: token,
        notes: [{ text: `Submitted survey responses on ${new Date().toLocaleDateString()}` }],
      }).catch((err: any) => console.warn('Lead creation non-fatal error:', err.message));
    }

    const payload = {
      submitted: true,
      submittedAt: new Date().toISOString(),
      message: 'Survey submitted successfully',
    };

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      ...payload,
      data: payload,
    });
  } catch (error: any) {
    console.error('Error in POST /api/surveys/s/[token]/submit:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Submission failed' },
      { status: 500 }
    );
  }
}
