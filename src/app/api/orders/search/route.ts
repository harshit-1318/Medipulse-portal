import { type NextRequest } from 'next/server';
import { GET as getCustomers } from '../customers/list/route';
import { GET as getPrescriptions } from '../prescription-list/route';
import { GET as getOrders } from '../route';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  if (type === 'customers') {
    return getCustomers(request);
  }
  if (type === 'prescriptions') {
    return getPrescriptions(request);
  }
  return getOrders(request);
}
