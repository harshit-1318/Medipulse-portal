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

    const rawNotes = lead.notes || [];
    const items = rawNotes.map((n: any, idx: number) => ({
      _id: n._id ? n._id.toString() : `${id}_note_${idx}`,
      leadId: id,
      text: n.text || '',
      createdBy: { _id: 'u1', username: 'Clinic Staff' },
      createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      items,
      total: items.length,
      data: { items, total: items.length },
    });
  } catch (error: any) {
    console.error('Error in GET /api/leads/[id]/notes:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Lead not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const text = (body.text || '').trim();
    if (!text) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Note text is required' }, { status: 400 });
    }

    await connectToDatabase();
    const newNote = { text, createdAt: new Date() };

    const updated = await Lead.findByIdAndUpdate(
      id,
      { $push: { notes: newNote }, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ status: 'ERROR', success: false, message: 'Lead not found' }, { status: 404 });
    }

    const notePayload = {
      _id: `${id}_note_${Date.now()}`,
      leadId: id,
      text,
      createdBy: { _id: 'u1', username: 'Clinic Staff' },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: notePayload,
      ...notePayload,
    });
  } catch (error: any) {
    console.error('Error in POST /api/leads/[id]/notes:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
