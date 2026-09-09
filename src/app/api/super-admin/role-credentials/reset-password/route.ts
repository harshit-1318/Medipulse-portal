import { NextResponse, type NextRequest } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

export async function POST(request: NextRequest) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json().catch(() => ({}));
    const { userId, newPassword: customPassword } = body;
    if (!userId) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'User ID is required' }, { status: 400 });
    }

    const newPassword = (customPassword || '').trim() || `MP-${Math.random().toString(36).slice(-6)}!26`;
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await connectToDatabase();
    const query = mongoose.isValidObjectId(userId) ? { _id: userId } : { email: userId };
    const updated = await User.findOneAndUpdate(query, { password: hashedPassword }, { new: true });
    if (!updated) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'User not found' }, { status: 404 });
    }

    await mongoose.connection.collection('activity_logs').insertOne({
      action: 'PASSWORD_RESET_BY_ADMIN',
      performedBy: auth.user?.email || 'Super Admin',
      targetUser: updated.email,
      timestamp: new Date(),
    }).catch(() => null);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { userId: String(updated._id), email: updated.email, newPassword },
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
