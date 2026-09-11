import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { verifyUserPassword, checkIsSuperAdmin, buildAuthPayload, setAuthCookies } from './helpers';
import { getRolePermissions } from './permissions';
import { recordActivity } from '@/lib/db/logActivityHelper';

// Auth login route handler
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    const emailStr = (email || '').trim().toLowerCase();
    const passwordStr = (password || '').trim();

    if (!emailStr || !passwordStr) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Email and password are required', data: null },
        { status: 400 }
      );
    }

    const dbUser = await User.findOne({
      email: { $regex: new RegExp(`^${emailStr}$`, 'i') },
    });

    if (!dbUser) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Invalid email or password', data: null },
        { status: 401 }
      );
    }

    if (dbUser.is_active === false) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Account is disabled. Please contact administrator.', data: null },
        { status: 403 }
      );
    }

    const isSuperAdmin = checkIsSuperAdmin(dbUser, emailStr);
    const passwordMatches = await verifyUserPassword(dbUser, passwordStr);

    if (!passwordMatches) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Invalid email or password', data: null },
        { status: 401 }
      );
    }

    const { userPayload, token, name } = await buildAuthPayload(dbUser, emailStr, isSuperAdmin);
    userPayload.permissions = isSuperAdmin ? ['*'] : getRolePermissions(userPayload.role);

    const response = NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        token,
        access_token: token,
        jwt: token,
        accessToken: token,
        user: userPayload,
      },
      message: 'Login successful',
    });

    setAuthCookies(response, token, userPayload.effectiveRole, name, userPayload.site_id);

    void recordActivity({
      action: 'login_success',
      action_type: 'login_success',
      user: name,
      user_name: name,
      user_email: emailStr,
      role: userPayload.effectiveRole,
      user_role: userPayload.effectiveRole,
      details: `${name} (${userPayload.effectiveRole}) logged in successfully`,
      page: 'auth',
      view: 'auth',
      site_id: userPayload.site_id,
    });

    return response;
  } catch (error: any) {
    console.error('Error in auth login API:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Login failed', data: null },
      { status: 500 }
    );
  }
}
