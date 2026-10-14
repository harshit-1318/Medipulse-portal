import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id || '').replace(/^#/, '');

    const payload = {
      ok: true,
      success: true,
      recordings: [],
      count: 0,
      room_prefix: 'mp-',
      customer_id: `cust_${cleanId}`,
    };

    return NextResponse.json({
      ...payload,
      data: payload,
    });
  } catch (error: any) {
    console.error('Error in GET /api/video/recordings/by-order/[id]:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
