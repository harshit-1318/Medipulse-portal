import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { verifyApiAuth } from '@/lib/auth/apiAuth';
import { buildUsersListFilter, buildNewUserDoc } from './userHelpers';

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const search = searchParams.get('search') || '';
    const site = searchParams.get('site') || searchParams.get('site_id') || '';
    const scope = searchParams.get('scope') || '';
    const sortBy = searchParams.get('sortBy') || searchParams.get('sort_by') || 'createdAt';
    const sort = searchParams.get('sort') || searchParams.get('sort_order') || 'desc';

    const filter = buildUsersListFilter(search, site, scope);
    const total = await User.countDocuments(filter);
    const sortDir = sort.toLowerCase() === 'asc' ? 1 : -1;
    const users = await User.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { users, total, page, limit },
      message: 'Users fetched from MongoDB Atlas successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message || 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));

    if (!body.email?.trim()) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Email is required' }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'A user with this email already exists' }, { status: 400 });
    }

    const siteHeader = request.headers.get('x-site-id') || undefined;
    const newUser = await User.create(buildNewUserDoc(body, email, siteHeader));
    return NextResponse.json({ status: 'SUCCESS', success: true, data: newUser, message: 'User created successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message || 'Failed to create' }, { status: 500 });
  }
}
