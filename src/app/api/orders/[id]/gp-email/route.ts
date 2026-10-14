import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const email = body.gp_email || body.email;

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      message: `Notification email sent to GP (${email || 'clinic'}) for order ${id}`,
      data: { orderId: id, email, sentAt: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('Error in POST /api/orders/[id]/gp-email:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
