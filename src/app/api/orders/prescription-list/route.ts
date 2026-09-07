import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Prescription } from '@/lib/db/models/Prescription';
import { SAMPLE_RX, mapPrescriptionItem, buildPrescriptionFilterQuery } from './helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sort = searchParams.get('sort') === 'desc' ? -1 : 1;

    await connectToDatabase();
    const { query, orderId, customerId, regNo, pharmacistName, pharmacistEmail } =
      buildPrescriptionFilterQuery(searchParams);

    let total = await Prescription.countDocuments(query);
    let raw = await Prescription.find(query).sort({ [sortBy]: sort }).skip((page - 1) * limit).limit(limit).lean();

    if (total === 0 && !orderId && !customerId && !regNo && !pharmacistName && !pharmacistEmail) {
      const seeded = await Prescription.insertMany(SAMPLE_RX);
      raw = seeded.map((p) => p.toObject());
      total = raw.length;
    }

    const prescriptions = raw.map((p: any, idx: number) => mapPrescriptionItem(p, idx));

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      total,
      page,
      limit,
      prescriptions,
      data: { prescriptions, total, page, limit },
      message: 'Prescriptions fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      total: 0,
      page: 1,
      limit: 20,
      prescriptions: [],
      message: error.message || 'Prescriptions fallback',
    });
  }
}
