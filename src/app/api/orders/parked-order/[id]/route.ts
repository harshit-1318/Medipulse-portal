import { NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const auth = await verifyApiAuth(request, {
    requiredRoles: ['super_admin', 'admin', 'prescriber', 'pharmacist', 'pharmacy_staff', 'customer_support'],
  });
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const { id } = await params;
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      message: `Order ${id} parked successfully`,
    });
  } catch (error: any) {
    console.error('Error in POST /api/orders/parked-order:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message },
      { status: 500 }
    );
  }
}
