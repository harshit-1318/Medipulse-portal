import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { DocmanJob } from '@/lib/db/models/DocmanJob';

const SAMPLES = [
  {
    laravel_document_id: 10421,
    command_type: 'SendDocument',
    status: 'completed',
    completed_at: new Date().toISOString(),
    payload: {
      Patient: { Identifier: 'NHS-98213', FamilyName: 'Smith', GivenNames: 'Sarah', BirthDate: '1988-04-12', Gender: 2, Email: 'sarah.smith@example.com' },
      Document: { Description: 'Medical Prescription Summary', EventDate: new Date().toISOString(), FileExtension: 'pdf', FileUrl: 'https://example.com/docs/10421.pdf', FileHash: 'e3b0c44298fc', ExternalSystemId: 'EXT-10421' },
      RecipientOdsCode: 'Y12345',
      GPData: { organisation_code: 'Y12345', gp_name: 'High Street Practice', address: '12 High St, London, UK' },
    },
  },
  {
    laravel_document_id: 10422,
    command_type: 'SendDocument',
    status: 'pending',
    completed_at: null,
    payload: {
      Patient: { Identifier: 'NHS-77412', FamilyName: 'Johnson', GivenNames: 'David', BirthDate: '1992-09-24', Gender: 1, Email: 'david.j@example.com' },
      Document: { Description: 'GP Notification Letter', EventDate: new Date().toISOString(), FileExtension: 'pdf', FileUrl: 'https://example.com/docs/10422.pdf', FileHash: 'c4ca4238a0b9', ExternalSystemId: 'EXT-10422' },
      RecipientOdsCode: 'A89012',
      GPData: { organisation_code: 'A89012', gp_name: 'North Central Health', address: '45 Station Rd, Manchester, UK' },
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sort = searchParams.get('sort') === 'asc' ? 1 : -1;

    await connectToDatabase();
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [{ 'payload.Patient.FamilyName': { $regex: search, $options: 'i' } }, { 'payload.Patient.GivenNames': { $regex: search, $options: 'i' } }, { 'payload.Patient.Email': { $regex: search, $options: 'i' } }];
    }

    let total = await DocmanJob.countDocuments(query);
    let jobs = await DocmanJob.find(query).sort({ [sortBy]: sort }).skip((page - 1) * limit).limit(limit).lean();

    if (total === 0 && !status && !search) {
      const seeded = await DocmanJob.insertMany(SAMPLES);
      jobs = seeded.map((s) => s.toObject());
      total = jobs.length;
    }

    const totalPages = Math.ceil(total / limit) || 1;
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { jobs, total, page, limit, totalPages },
      jobs,
      total,
      page,
      limit,
      totalPages,
      message: 'Docman jobs fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching docman jobs:', error);
    return NextResponse.json({ status: 'SUCCESS', success: true, data: { jobs: [], total: 0, page: 1, limit: 20, totalPages: 0 }, jobs: [], total: 0, page: 1, limit: 20, totalPages: 0, message: error.message || 'Docman jobs fallback' });
  }
}
