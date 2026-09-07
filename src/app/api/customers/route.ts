import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Customer } from '@/lib/db/models/Customer';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    let customers = await Customer.find().limit(50).lean();

    if (customers.length === 0) {
      const sampleCustomers = await Customer.insertMany([
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+447123456789',
          status: 'active',
          totalOrders: 3,
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+447987654321',
          status: 'active',
          totalOrders: 1,
        },
      ]);
      customers = sampleCustomers.map((c) => c.toObject());
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: {
        customers,
        total: customers.length,
        page: 1,
        limit: 50,
      },
      message: 'Customers fetched from MongoDB Atlas successfully',
    });
  } catch (error: any) {
    console.error('Error fetching customers from MongoDB:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        success: false,
        message: error.message || 'Failed to fetch customers',
        data: null,
      },
      { status: 500 }
    );
  }
}
