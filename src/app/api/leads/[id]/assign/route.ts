import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';
import { User } from '@/lib/db/models/User';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Lead not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const userId = body.userId;

    await connectToDatabase();
    let assignedTo = null;

    if (userId) {
      const user = mongoose.Types.ObjectId.isValid(userId)
        ? await User.findById(userId).lean()
        : await User.findOne({ email: userId }).lean();

      if (user) {
        assignedTo = {
          _id: user._id.toString(),
          username: user.name || user.email || 'Staff Member',
        };
      } else {
        assignedTo = {
          _id: userId,
          username: 'Assigned Specialist',
        };
      }
    }

    const noteText = assignedTo ? `Assigned to ${assignedTo.username}` : 'Lead unassigned';
    const updated = await Lead.findByIdAndUpdate(
      id,
      {
        assignedTo,
        $push: { notes: { text: noteText, createdAt: new Date() } },
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      assignedTo,
      data: { assignedTo },
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/leads/[id]/assign:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
