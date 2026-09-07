import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { verifyApiAuth } from '@/lib/auth/apiAuth';
import { resolveId, getUserQuery, buildUserUpdateFields, type RouteContext } from '../userHelpers';

export async function GET(req: Request, ctx: RouteContext) {
  const auth = await verifyApiAuth(req, { requireSuperAdmin: true });
  if (!auth.authorized) return auth.errorResponse!;

  try {
    await connectToDatabase();
    const user = await User.findOne(getUserQuery(await resolveId(ctx))).lean();
    if (!user) return NextResponse.json({ status: 'ERROR', success: false, message: 'User not found' }, { status: 404 });
    return NextResponse.json({ status: 'SUCCESS', success: true, data: user, message: 'User fetched successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message || 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: RouteContext) {
  const auth = await verifyApiAuth(req, { requireSuperAdmin: true });
  if (!auth.authorized) return auth.errorResponse!;

  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const updateFields = buildUserUpdateFields(body);
    const updated = await User.findOneAndUpdate(getUserQuery(await resolveId(ctx)), updateFields, { new: true }).lean();
    if (!updated) return NextResponse.json({ status: 'ERROR', success: false, message: 'User not found' }, { status: 404 });
    return NextResponse.json({ status: 'SUCCESS', success: true, data: updated, message: 'User updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message || 'Failed to update' }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: RouteContext) {
  return PATCH(req, ctx);
}

export async function DELETE(req: Request, ctx: RouteContext) {
  const auth = await verifyApiAuth(req, { requireSuperAdmin: true });
  if (!auth.authorized) return auth.errorResponse!;

  try {
    await connectToDatabase();
    const deleted = await User.findOneAndDelete(getUserQuery(await resolveId(ctx))).lean();
    if (!deleted) return NextResponse.json({ status: 'ERROR', success: false, message: 'User not found' }, { status: 404 });
    return NextResponse.json({ status: 'SUCCESS', success: true, data: deleted, message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message || 'Failed to delete' }, { status: 500 });
  }
}
