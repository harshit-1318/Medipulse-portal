import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyApiAuth } from '@/lib/auth/apiAuth';
import { generateSeedBatch } from './seedDataHelper';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  const auth = await verifyApiAuth(request, { requiredRoles: ['super_admin', 'admin'] });
  if (!auth.authorized && process.env.NODE_ENV === 'production') {
    return auth.errorResponse!;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.min(100, Math.max(1, parseInt(body.count || '10', 10)));
    const clean = body.clean === true;

    await connectToDatabase();
    const db = mongoose.connection;
    const ordersCol = db.collection('orders');
    const rxCol = db.collection('prescriptions');
    const customersCol = db.collection('customers');

    if (clean) {
      await ordersCol.deleteMany({ tags: 'mock_seed' });
      await rxCol.deleteMany({ status: 'mock_seed' });
    }

    const dates: string[] = [];
    if (body.days && parseInt(body.days, 10) > 1) {
      const numDays = Math.min(30, parseInt(body.days, 10));
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
    } else {
      dates.push(body.date || new Date().toISOString().split('T')[0]);
    }

    let totalCreated = 0;
    for (const d of dates) {
      const { orders, rxList, customers } = generateSeedBatch(d, count);
      await ordersCol.insertMany(orders);
      await rxCol.insertMany(rxList);
      for (const c of customers) {
        await customersCol.updateOne(
          { email: c.email },
          { $set: { name: c.name, phone: c.phone, status: c.status }, $setOnInsert: { createdAt: c.orderDate }, $inc: { totalOrders: 1 } },
          { upsert: true }
        );
      }
      totalCreated += orders.length;
    }

    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: { createdOrders: totalCreated, dates, countPerDate: count },
      message: `Successfully seeded ${totalCreated} fake orders for: ${dates.join(', ')}`,
    });
  } catch (error: any) {
    console.error('Error in POST /api/seed:', error);
    return NextResponse.json({ status: 'ERROR', success: false, message: error.message }, { status: 500 });
  }
}
