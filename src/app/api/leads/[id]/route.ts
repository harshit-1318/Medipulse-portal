import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Lead not found', data: null },
        { status: 404 }
      );
    }

    await connectToDatabase();
    const lead = await Lead.findById(id).lean();
    if (!lead) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Lead not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: lead,
      message: 'Lead fetched successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to fetch lead', data: null },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Lead not found', data: null },
        { status: 404 }
      );
    }

    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const updated = await Lead.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Lead not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: updated,
      message: 'Lead updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to update lead', data: null },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, ctx: RouteContext) {
  return PATCH(request, ctx);
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Lead not found', data: null },
        { status: 404 }
      );
    }

    await connectToDatabase();
    await Lead.findByIdAndDelete(id);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { id },
      message: 'Lead deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to delete lead', data: null },
      { status: 500 }
    );
  }
}
