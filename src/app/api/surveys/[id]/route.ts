import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Survey } from '@/lib/db/models/Survey';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const survey = await Survey.findById(id).lean();
    if (!survey) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Survey not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: survey,
      message: 'Survey fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching survey by id:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to fetch survey', data: null },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const updated = await Survey.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) {
      return NextResponse.json(
        { status: 'ERROR', success: false, message: 'Survey not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: updated,
      message: 'Survey updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating survey:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to update survey', data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    await Survey.findByIdAndDelete(id);

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: null,
      message: 'Survey deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting survey:', error);
    return NextResponse.json(
      { status: 'ERROR', success: false, message: error.message || 'Failed to delete survey', data: null },
      { status: 500 }
    );
  }
}
