import { NextResponse, type NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { verifyApiAuth } from '@/lib/auth/apiAuth';
import { deriveDisplayPassword } from '../helpers';

export async function POST(request: NextRequest) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json().catch(() => ({}));
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'User ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const query = mongoose.isValidObjectId(userId) ? { _id: userId } : { email: userId };
    const user = await User.findOne(query).lean();
    if (!user) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'User not found' }, { status: 404 });
    }

    const db = mongoose.connection;
    await db.collection('activity_logs').insertOne({
      action: 'CREDENTIAL_REVEALED',
      performedBy: auth.user?.email || 'Super Admin',
      targetUser: user.email,
      targetRole: user.role,
      details: `Super Admin accessed credential for ${user.email} (${user.role})`,
      timestamp: new Date(),
    }).catch(() => null);

    const revealedPassword = deriveDisplayPassword(user);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { userId: String(user._id), email: user.email, revealedPassword },
      message: 'Credential revealed for 15 seconds',
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
