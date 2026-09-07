import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { DocmanJob } from '@/lib/db/models/DocmanJob';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const query: any[] = [{ laravel_document_id: id }];
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      query.push({ _id: new mongoose.Types.ObjectId(id) });
    }

    const job = await DocmanJob.findOne({ $or: query }).lean();

    if (!job) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: job,
      ...job,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const query: any[] = [{ laravel_document_id: id }];
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      query.push({ _id: new mongoose.Types.ObjectId(id) });
    }

    await DocmanJob.findOneAndDelete({ $or: query });

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to delete job' },
      { status: 500 }
    );
  }
}
