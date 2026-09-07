import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: body,
      message: 'Order status updated successfully',
    });
  } catch (error: any) {
    console.error('Error in POST /api/orders/update-status:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message },
      { status: 500 }
    );
  }
}
