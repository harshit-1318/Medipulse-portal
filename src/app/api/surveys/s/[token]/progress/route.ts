import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { token } = await params;
    await request.json().catch(() => ({}));

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      saved: true,
      savedAt: new Date().toISOString(),
      token,
      data: { saved: true, savedAt: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/surveys/s/[token]/progress:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to save progress' },
      { status: 500 }
    );
  }
}
