import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        _id: 'act_' + Date.now(),
        ...body,
        createdAt: new Date().toISOString(),
      },
      message: 'Activity logged successfully',
    });
  } catch (error: any) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to log activity',
        data: null,
      },
      { status: 500 }
    );
  }
}
