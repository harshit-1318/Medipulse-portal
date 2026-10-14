import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id || '').replace(/^#/, '');
    const roomUrl = `https://meet.medipulse.io/consultation-${cleanId}`;

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      roomUrl,
      id: cleanId,
      data: { roomUrl, orderId: cleanId },
    });
  } catch (error: any) {
    console.error('Error in GET /api/video/create-room/[id]:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
