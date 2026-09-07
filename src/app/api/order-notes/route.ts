import { NextResponse } from 'next/server';
import { orderNotesStore, type StoredOrderNote } from '@/lib/stores/inMemoryOrderNotes';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const cleanOrderId = decodeURIComponent(body.orderId || body.order_id || '')
      .trim()
      .replace(/^#/, '');

    const newNote: StoredOrderNote = {
      _id: `note_${Date.now()}`,
      order_id: cleanOrderId,
      note: body.note || '',
      user_id: body.user_id || { _id: 'user_current', name: 'Dr. Sarah Jenkins' },
      createdAt: new Date().toISOString(),
    };

    orderNotesStore.unshift(newNote);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: newNote,
      message: 'Note added successfully',
    });
  } catch (error: any) {
    console.error('Error in POST /api/order-notes:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message },
      { status: 500 }
    );
  }
}
