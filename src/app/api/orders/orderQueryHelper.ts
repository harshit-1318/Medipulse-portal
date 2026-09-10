import { applyStatusFilter } from './orderStatusFilter';
import { applyProductAndDocFilters } from './orderProductFilter';
import { applyDateFilter, parseDateBoundary } from './orderDateFilter';

export { parseDateBoundary, applyDateFilter };

export interface OrderQueryParams {
  query: Record<string, any>;
  sortOptions: Record<string, 1 | -1>;
  page: number;
  limit: number;
}

export function buildOrderQuery(searchParams: URLSearchParams): OrderQueryParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sort') === 'asc' ? 1 : -1;

  const query: Record<string, any> = {};
  const andClauses: Record<string, any>[] = [];

  if (searchParams.get('isUrgent') === 'true') {
    andClauses.push({ $or: [{ isUrgent: true }, { urgent: true }, { tags: { $regex: 'makeurgent', $options: 'i' } }] });
  }
  if (searchParams.get('isParked') === 'true') {
    andClauses.push({ $or: [{ isParked: true }, { tags: { $regex: 'parkedorder', $options: 'i' } }] });
  }

  const orderId = searchParams.get('orderId');
  if (orderId) {
    const cleanId = orderId.replace('#', '').trim();
    const pattern = cleanId.replace(/[\s-]+/g, '[- ]?');
    andClauses.push({
      $or: [
        { orderNumber: { $regex: pattern, $options: 'i' } },
        { shopify_order_id: { $regex: cleanId, $options: 'i' } },
        { store_order_id: { $regex: cleanId, $options: 'i' } },
      ],
    });
  }

  const customerId = searchParams.get('customerId');
  if (customerId) {
    const cleanCid = customerId.replace(/^[#\s]+/, '').trim();
    andClauses.push({
      $or: [
        { store_order_id: { $regex: cleanCid, $options: 'i' } },
        { shopify_order_id: { $regex: cleanCid, $options: 'i' } },
        { customerId: { $regex: cleanCid, $options: 'i' } },
      ],
    });
  }

  const customerName = searchParams.get('customerName');
  if (customerName) query.customerName = { $regex: customerName.trim(), $options: 'i' };

  const customerEmail = searchParams.get('customerEmail');
  if (customerEmail) query.customerEmail = { $regex: customerEmail.trim(), $options: 'i' };

  const generalCustomer = searchParams.get('customer');
  if (generalCustomer && !customerName && !customerEmail && !customerId) {
    const val = generalCustomer.trim();
    const cleanDigits = val.replace(/^[#\s]+/, '');
    if (val.includes('@')) {
      query.customerEmail = { $regex: val, $options: 'i' };
    } else if (/^\d+$/.test(cleanDigits)) {
      andClauses.push({
        $or: [
          { store_order_id: { $regex: cleanDigits, $options: 'i' } },
          { shopify_order_id: { $regex: cleanDigits, $options: 'i' } },
          { customerId: { $regex: cleanDigits, $options: 'i' } },
        ],
      });
    } else {
      query.customerName = { $regex: val, $options: 'i' };
    }
  }

  applyDateFilter(query, searchParams);

  const orderType = searchParams.get('order_type') || searchParams.get('repeatedOrders');
  if (orderType === 'first') {
    andClauses.push({ $or: [{ order_type: 'first' }, { repeatedOrders: 0 }, { repeatedOrders: { $exists: false } }] });
  } else if (orderType === 'repeat') {
    andClauses.push({ $or: [{ order_type: 'repeat' }, { repeatedOrders: { $gt: 0 } }] });
  }

  applyStatusFilter(query, searchParams, andClauses);
  applyProductAndDocFilters(query, searchParams, andClauses);

  if (andClauses.length > 0) {
    query.$and = andClauses;
  }

  return { query, sortOptions: { [sortBy]: sortDir }, page, limit };
}
