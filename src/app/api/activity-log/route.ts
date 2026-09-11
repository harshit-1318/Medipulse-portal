import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ActivityLog } from '@/lib/db/models/ActivityLog';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const action = body.action || body.action_type || 'activity';
    const email = (body.user_email || body.userEmail || '').trim().toLowerCase();

    const newLog = await ActivityLog.create({
      ...body,
      action,
      action_type: body.action_type || action,
      user: body.user || body.user_name || 'Staff',
      user_name: body.user_name || body.user || 'Staff',
      user_email: email,
      role: body.role || body.user_role || 'staff',
      user_role: body.user_role || body.role || 'staff',
      orderId: body.orderId || body.object_guid || '',
      object_guid: body.object_guid || body.orderId || '',
      details: body.details || '',
      page: body.page || body.view || 'general',
      view: body.view || body.page || 'general',
      createdAt: new Date(),
    });

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: newLog,
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
