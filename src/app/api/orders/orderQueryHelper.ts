import { applyStatusFilter } from './orderStatusFilter';

export interface OrderQueryParams {
  query: Record<string, any>;
  sortOptions: Record<string, 1 | -1>;
  page: number;
  limit: number;
}

export function parseDateBoundary(dateStr: string, isEnd = false): Date {
  const parts = dateStr.split('T')[0].split('-').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    const [year, month, day] = parts;
    return isEnd
      ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
      : new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  }
  const fallback = new Date(dateStr);
  return isEnd ? new Date(fallback.setUTCHours(23, 59, 59, 999)) : new Date(fallback.setUTCHours(0, 0, 0, 0));
}

export function buildOrderQuery(searchParams: URLSearchParams): OrderQueryParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sort') === 'asc' ? 1 : -1;

  const query: Record<string, any> = {};

  if (searchParams.get('isUrgent') === 'true') query.isUrgent = true;
  if (searchParams.get('isParked') === 'true') query.isParked = true;

  const orderId = searchParams.get('orderId');
  if (orderId) query.orderNumber = { $regex: orderId.replace('#', '').trim(), $options: 'i' };

  const customerName = searchParams.get('customerName') || searchParams.get('customer');
  if (customerName) query.customerName = { $regex: customerName.trim(), $options: 'i' };

  const customerEmail = searchParams.get('customerEmail');
  if (customerEmail) query.customerEmail = { $regex: customerEmail.trim(), $options: 'i' };

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = parseDateBoundary(startDate, false);
    if (endDate) query.createdAt.$lte = parseDateBoundary(endDate, true);
  }

  const orderType = searchParams.get('order_type') || searchParams.get('repeatedOrders');
  if (orderType === 'first') {
    query.$or = [
      { order_type: 'first' },
      { repeatedOrders: 0 },
      { repeatedOrders: { $exists: false } },
    ];
  } else if (orderType === 'repeat') {
    query.$or = [
      { order_type: 'repeat' },
      { repeatedOrders: { $gt: 0 } },
    ];
  }

  applyStatusFilter(query, searchParams);

  return { query, sortOptions: { [sortBy]: sortDir }, page, limit };
}
