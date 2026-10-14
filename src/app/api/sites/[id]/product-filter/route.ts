import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const productIds = Array.isArray(body.product_ids) ? body.product_ids : [];

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        siteId: id,
        product_ids: productIds,
      },
      message: 'Product filter updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to update product filter', data: null },
      { status: 500 }
    );
  }
}
