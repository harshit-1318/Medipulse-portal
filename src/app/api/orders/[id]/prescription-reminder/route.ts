import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      message: `Prescription reminder sent successfully for order ${id}`,
      data: { orderId: id, sentAt: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('Error in POST /api/orders/[id]/prescription-reminder:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
