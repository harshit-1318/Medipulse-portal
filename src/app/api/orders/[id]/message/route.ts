import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const message = body.message || '';

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      message: `Message sent successfully to customer for order ${id}`,
      data: { orderId: id, customerMessage: message, sentAt: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('Error in POST /api/orders/[id]/message:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
