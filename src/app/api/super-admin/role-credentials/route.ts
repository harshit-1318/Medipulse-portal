import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { verifyApiAuth } from '@/lib/auth/apiAuth';
import { getRolePermissions } from '@/app/api/auth/login/permissions';
import { buildRoleQueryFilter, getSortDirective } from './helpers';

export async function GET(request: NextRequest) {
  const auth = await verifyApiAuth(request, { requireSuperAdmin: true });
  if (!auth.authorized) return auth.errorResponse!;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sort = searchParams.get('sort') || 'desc';

    const filter = buildRoleQueryFilter(search, role, status);
    const [total, users, allUsers] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort(getSortDirective(sortBy, sort))
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.find({}, { role: 1, is_active: 1 }).lean(),
    ]);

    const activeAccounts = allUsers.filter((u) => u.is_active !== false).length;
    const inactiveAccounts = allUsers.length - activeAccounts;
    const distinctRoles = new Set(allUsers.map((u) => u.role?.toLowerCase() || 'user'));

    const items = users.map((u: any) => ({
      _id: String(u._id),
      name: u.name || u.email.split('@')[0],
      email: u.email,
      role: u.role || 'user',
      is_active: u.is_active !== false,
      is_super_admin: Boolean(u.is_super_admin),
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
      lastLogin: u.updatedAt ? new Date(u.updatedAt).toISOString() : 'Never',
      hasPassword: Boolean(u.password),
      permissions: getRolePermissions(u.role || 'user'),
    }));

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        users: items,
        stats: {
          totalAccounts: allUsers.length,
          activeAccounts,
          inactiveAccounts,
          totalRoles: Math.max(distinctRoles.size, 1),
        },
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
