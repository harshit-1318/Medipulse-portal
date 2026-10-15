import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { Customer } from '@/lib/db/models/Customer';
import type { GlobalSearchOrder, GlobalSearchCustomer } from '@/types/globalSearch';
import { verifyApiAuth } from '@/lib/auth/apiAuth';

const SEARCH_ROLES = [
  'super_admin',
  'admin',
  'prescriber',
  'pharmacist',
  'pharmacy_staff',
  'customer_support',
  'driver',
];

export async function GET(request: Request) {
  const auth = await verifyApiAuth(request, { requiredRoles: SEARCH_ROLES });
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    if (q.length < 2) {
      return NextResponse.json({ orders: [], customers: [] });
    }

    await connectToDatabase();
    const isDigits = /^\d+$/.test(q);
    const isEmail = q.includes('@');
    const isOrderNumber = q.startsWith('#');
    const safeRegex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const orderFilter = isDigits
      ? { $or: [{ shopify_order_id: Number(q) }, { orderNumber: { $regex: safeRegex } }] }
      : isOrderNumber
      ? { orderNumber: { $regex: safeRegex } }
      : isEmail
      ? { customerEmail: { $regex: safeRegex } }
      : {
          $or: [
            { orderNumber: { $regex: safeRegex } },
            { customerName: { $regex: safeRegex } },
            { customerEmail: { $regex: safeRegex } },
          ],
        };

    const customerFilter = isEmail
      ? { email: { $regex: safeRegex } }
      : {
          $or: [
            { name: { $regex: safeRegex } },
            { email: { $regex: safeRegex } },
          ],
        };

    const [orderDocs, customerDocs] = await Promise.all([
      Order.find(orderFilter).limit(8).lean(),
      Customer.find(customerFilter).limit(8).lean(),
    ]);

    const orders: GlobalSearchOrder[] = orderDocs.map((o: any) => ({
      shopify_order_id: Number(o.shopify_order_id || o.orderNumber?.replace(/\D/g, '') || 1001),
      store_order_id: Number(o.shopify_order_id || 1001),
      order_name: o.orderNumber || `#${o._id}`,
      email: o.customerEmail || '',
      customerName: o.customerName || 'Customer',
      status: o.status || 'pending',
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
      matchType: (o.orderNumber === q || o.customerEmail === q) ? 'exact' : 'partial',
    }));

    const customers: GlobalSearchCustomer[] = customerDocs.map((c: any, idx: number) => {
      const parts = (c.name || 'Customer').split(' ');
      return {
        customer_id: Number(c.customerId || idx + 1),
        email: c.email || '',
        firstName: parts[0] || 'Customer',
        lastName: parts.slice(1).join(' ') || '',
        matchType: c.email === q ? 'exact' : 'partial',
      };
    });

    return NextResponse.json({ orders, customers });
  } catch (error: any) {
    console.error('Error in GET /api/global-search:', error);
    return NextResponse.json({ orders: [], customers: [] });
  }
}
