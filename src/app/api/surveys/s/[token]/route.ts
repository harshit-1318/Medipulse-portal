import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { token } = await params;
    const cleanToken = decodeURIComponent(token || '').trim();

    if (!cleanToken || cleanToken === 'invalid-token' || cleanToken.startsWith('invalid')) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Survey session not found or invalid token' },
        { status: 404 }
      );
    }

    await connectToDatabase();
    let surveyDoc = null;
    if (mongoose.Types.ObjectId.isValid(cleanToken)) {
      surveyDoc = await Survey.findById(cleanToken).lean();
    }
    if (!surveyDoc) {
      surveyDoc = await Survey.findOne({ status: 'published' }).lean();
    }
    if (!surveyDoc) {
      surveyDoc = await Survey.findOne().lean();
    }

    const title = surveyDoc?.title || 'Patient Health Assessment';
    const schema = (surveyDoc?.schema && Object.keys(surveyDoc.schema).length > 0)
      ? surveyDoc.schema
      : {
          title,
          pages: [
            {
              name: 'general_info',
              elements: [
                { type: 'text', name: 'customerName', title: 'Full Name', isRequired: true },
                { type: 'text', name: 'customerEmail', title: 'Email Address', inputType: 'email', isRequired: true },
                { type: 'radiogroup', name: 'symptoms', title: 'Are you experiencing any side effects?', choices: ['None', 'Mild', 'Severe'] },
              ],
            },
          ],
        };

    const sessionData = {
      sessionId: `sess_${cleanToken}`,
      status: 'in_progress',
      surveyTitle: title,
      schema,
      partialResponse: null,
      currentPage: 0,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      alreadySubmitted: false,
      expired: false,
    };

    return NextResponse.json({
      success: true,
      data: sessionData,
      ...sessionData,
    });
  } catch (error: any) {
    console.error('Error in GET /api/surveys/s/[token]:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
