import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const isReadOnly = Boolean(body.is_read_only);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        siteId: id,
        is_read_only: isReadOnly,
      },
      message: `Site read-only state set to ${isReadOnly}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to toggle read-only', data: null },
      { status: 500 }
    );
  }
}
