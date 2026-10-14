import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Lead not found' }, { status: 404 });
    }

    await connectToDatabase();
    const lead = await Lead.findById(id).lean();
    if (!lead) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Lead not found' }, { status: 404 });
    }

    const items: Array<{
      _id: string;
      leadId: string;
      action: string;
      performedBy: { _id: string; username: string };
      details: Record<string, any>;
      createdAt: string;
    }> = [
      {
        _id: `${id}_act_created`,
        leadId: id,
        action: 'Lead Created',
        performedBy: { _id: 'sys', username: 'System Ingestion' },
        details: { status: lead.status },
        createdAt: lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
      },
    ];

    if (lead.notes && lead.notes.length > 0) {
      lead.notes.forEach((n: any, idx: number) => {
        items.push({
          _id: `${id}_act_note_${idx}`,
          leadId: id,
          action: 'Note Added',
          performedBy: { _id: 'u1', username: 'Clinic Staff' },
          details: { note: n.text },
          createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
        });
      });
    }

    return NextResponse.json({
      success: true,
      items,
      total: items.length,
      data: { items, total: items.length },
    });
  } catch (error: any) {
    console.error('Error in GET /api/leads/[id]/activity:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
