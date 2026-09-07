import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    let surveys = await Survey.find().limit(50).lean();

    // Seed initial demo survey in MongoDB Atlas if collection is empty
    if (surveys.length === 0) {
      const sampleSurvey = await Survey.create({
        title: 'Weight Loss Consultation Survey',
        description: 'Initial health assessment for weight management program',
        slug: 'weight-loss-assessment',
        status: 'published',
        currentVersion: 1,
        schema: {
          pages: [
            {
              name: 'general',
              elements: [
                { type: 'text', name: 'bmi', title: 'What is your current BMI?' },
                { type: 'radiogroup', name: 'medical_conditions', title: 'Do you have diabetes or high BP?', choices: ['Yes', 'No'] },
              ],
            },
          ],
        },
        settings: {
          expiryDays: 7,
          captchaEnabled: false,
          allowedDomains: [],
          submissionLimit: null,
        },
      });
      surveys = [sampleSurvey];
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        items: surveys,
        surveys,
        total: surveys.length,
        page: 1,
        limit: 50,
        totalPages: Math.ceil(surveys.length / 50) || 1,
      },
      message: 'Surveys fetched from MongoDBAtlas successfully',
    });
  } catch (error: any) {
    console.error('Error fetching surveys from MongoDB:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch surveys from MongoDB',
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const newSurvey = await Survey.create({
      title: body.title || 'Untitled Survey',
      description: body.description || '',
      slug: body.slug || `survey-${Date.now()}`,
      status: body.status || 'draft',
      schema: body.schema || body.jsonSchema || {},
    });

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: newSurvey,
      message: 'Survey created in MongoDB successfully',
    });
  } catch (error: any) {
    console.error('Error creating survey in MongoDB:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to create survey',
        data: null,
      },
      { status: 500 }
    );
  }
}
