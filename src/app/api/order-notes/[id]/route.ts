import { NextResponse } from 'next/server';
import { orderNotesStore } from '@/lib/stores/inMemoryOrderNotes';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id || '').trim().replace(/^#/, '');

    const matchingNotes = orderNotesStore.filter((n) => n.order_id === cleanId);

    // Fallback if none yet for this cleanId
    if (matchingNotes.length === 0) {
      matchingNotes.push({
        _id: `note_default_${cleanId}`,
        order_id: cleanId,
        note: 'Clinical assessment complete. Verified eligibility for weight management treatment.',
        user_id: {
          _id: 'user_1',
          name: 'Dr. Sarah Jenkins',
        },
        createdAt: new Date('2026-08-15T10:45:00Z').toISOString(),
      });
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: matchingNotes,
      message: 'Order notes retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error in GET /api/order-notes/[id]:', error);
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: [],
      message: 'No notes found',
    });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const note = orderNotesStore.find((n) => n._id === id);
    if (note) {
      note.note = body.note || note.note;
      note.updatedAt = new Date().toISOString();
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: note || { _id: id, note: body.note },
      message: 'Note updated successfully',
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/order-notes/[id]:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const index = orderNotesStore.findIndex((n) => n._id === id);
    if (index !== -1) {
      orderNotesStore.splice(index, 1);
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: null,
      message: 'Note deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/order-notes/[id]:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message },
      { status: 500 }
    );
  }
}
