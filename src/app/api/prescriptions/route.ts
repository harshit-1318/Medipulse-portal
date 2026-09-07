import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Prescription } from '@/lib/db/models/Prescription';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    let prescriptions = await Prescription.find().limit(50).lean();

    if (prescriptions.length === 0) {
      const samplePrescriptions = await Prescription.insertMany([
        {
          patientName: 'John Doe',
          patientEmail: 'john@example.com',
          medication: 'Semaglutide 0.25mg/0.5mg',
          dosage: 'Weekly Injection',
          status: 'verified',
        },
        {
          patientName: 'Jane Smith',
          patientEmail: 'jane@example.com',
          medication: 'Mounjaro 2.5mg',
          dosage: 'Weekly Injection',
          status: 'pending_doctor_review',
        },
      ]);
      prescriptions = samplePrescriptions.map((p) => p.toObject());
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        prescriptions,
        total: prescriptions.length,
        page: 1,
        limit: 50,
      },
      message: 'Prescriptions fetched from MongoDB Atlas successfully',
    });
  } catch (error: any) {
    console.error('Error in GET /api/prescriptions:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message, data: null }, { status: 500 });
  }
}
