import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lead } from '@/lib/db/models/Lead';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const searchParam = searchParams.get('search')?.toLowerCase() || '';

    await connectToDatabase();
    let leads = await Lead.find().limit(50).lean();

    if (leads.length === 0) {
      const sampleLeads = await Lead.insertMany([
        {
          customerName: 'Robert Johnson',
          customerEmail: 'robert@example.com',
          status: 'new',
          notes: [{ text: 'Inquired about GLP-1 weight loss treatment', createdAt: new Date() }],
        },
        {
          customerName: 'Sarah Connor',
          customerEmail: 'sarah@example.com',
          status: 'contacted',
          notes: [{ text: 'Sent initial survey form link', createdAt: new Date() }],
        },
      ]);
      leads = sampleLeads.map((l) => l.toObject());
    }

    let filteredLeads = leads;
    if (statusParam && statusParam !== 'all') {
      filteredLeads = filteredLeads.filter((l: any) => l.status === statusParam);
    }
    if (searchParam) {
      filteredLeads = filteredLeads.filter((l: any) => 
        (l.customerName || '').toLowerCase().includes(searchParam) ||
        (l.customerEmail || '').toLowerCase().includes(searchParam)
      );
    }

    const items = filteredLeads.map((l: any) => ({
      _id: l._id?.toString() || 'lead_1',
      siteId: l.siteId || '65e0123456789abcdef00001',
      surveyId: l.surveyId || 'survey_1',
      customerId: l.customerId || 'cust_1',
      customer: {
        name: l.customerName || 'Robert Johnson',
        email: l.customerEmail || 'robert@example.com',
        phone: l.customerPhone || '+44 7700 900077',
      },
      survey: {
        title: l.surveyTitle || 'GLP-1 Weight Loss Consultation',
      },
      status: l.status || 'new',
      assignedTo: l.assignedTo || null,
      notesCount: (l.notes || []).length,
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: l.updatedAt ? new Date(l.updatedAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        items,
        total: items.length,
        page: 1,
        limit: 50,
        totalPages: 1,
      },
      message: 'Leads fetched from MongoDB Atlas successfully',
    });
  } catch (error: any) {
    console.error('Error in GET /api/leads:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message, data: null }, { status: 500 });
  }
}
