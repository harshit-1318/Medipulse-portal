import { NextResponse, type NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function POST(request: NextRequest) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json().catch(() => ({}));
    const { userId, is_active } = body;
    if (!userId || typeof is_active !== 'boolean') {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Invalid payload' }, { status: 400 });
    }

    await connectToDatabase();
    const query = mongoose.isValidObjectId(userId) ? { _id: userId } : { email: userId };
    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.role === 'super_admin' && !is_active) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Super Admin account cannot be deactivated' }, { status: 400 });
    }

    user.is_active = is_active;
    await user.save();

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { userId: String(user._id), email: user.email, is_active: user.is_active },
      message: `Account ${is_active ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
