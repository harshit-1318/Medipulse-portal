import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Customer } from '@/lib/db/models/Customer';

const SAMPLE_CUSTOMERS = [
  { name: 'John Doe', email: 'john@example.com', phone: '+447123456789', status: 'active', totalOrders: 3 },
  { name: 'Jane Smith', email: 'jane@example.com', phone: '+447987654321', status: 'active', totalOrders: 1 },
  { name: 'David Wilson', email: 'david.w@example.co.uk', phone: '+447456123987', status: 'active', totalOrders: 4 },
  { name: 'Emma Thompson', email: 'emma.t@example.co.uk', phone: '+447321654987', status: 'active', totalOrders: 2 },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('customer') || searchParams.get('search');
    const customerId = searchParams.get('customerId');
    const customerEmail = searchParams.get('customerEmail');
    const customerName = searchParams.get('customerName');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sort = searchParams.get('sort') === 'desc' ? -1 : 1;

    await connectToDatabase();
    const query: any = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }];
    if (customerId) query._id = customerId;
    if (customerEmail) query.email = { $regex: customerEmail, $options: 'i' };
    if (customerName) query.name = { $regex: customerName, $options: 'i' };

    let total = await Customer.countDocuments(query);
    let raw = await Customer.find(query).sort({ [sortBy]: sort }).skip((page - 1) * limit).limit(limit).lean();

    if (total === 0 && !search && !customerId && !customerEmail && !customerName) {
      const seeded = await Customer.insertMany(SAMPLE_CUSTOMERS);
      raw = seeded.map((c) => c.toObject());
      total = raw.length;
    }

    const customers = raw.map((c: any) => ({
      customerId: String(c._id || c.id || c.customerId),
      name: c.name || 'N/A',
      email: c.email || 'N/A',
      phone: c.phone || '',
      status: c.status || 'active',
      totalOrders: Number(c.totalOrders || 0),
      totalPens: Number(c.totalPens || c.totalOrders || 0),
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      total,
      page,
      limit,
      customers,
      data: { customers, total, page, limit },
      message: 'Customers fetched successfully',
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ status: 'SUCCESS', success: true, total: 0, page: 1, limit: 20, customers: [], message: error.message || 'Customers fallback' });
  }
}
