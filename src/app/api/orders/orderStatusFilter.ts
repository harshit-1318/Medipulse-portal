export function applyStatusFilter(query: Record<string, any>, searchParams: URLSearchParams): void {
  const raw = searchParams.get('fulfillmentStatus') ||
    searchParams.get('fulfillment_status') ||
    searchParams.get('orderStatus') ||
    searchParams.get('status');

  if (!raw || raw === 'all') return;
  const s = raw.toLowerCase().trim().replace(/[\s-]+/g, '_');

  let condition: Record<string, any> | null = null;
  if (s === 'on_hold' || s === 'hold') {
    condition = {
      $or: [
        { status: { $in: ['on_hold', 'hold'] } },
        { fulfillment_status: 'on_hold' },
      ],
    };
  } else if (s === 'unfulfilled') {
    condition = {
      $or: [
        { status: { $in: ['unfulfilled', 'pending_doctor_approval', 'payment_pending', 'consultation_approved', 'pending'] } },
        { fulfillment_status: 'unfulfilled' },
      ],
    };
  } else if (s === 'fulfilled') {
    condition = {
      $or: [
        { status: { $in: ['fulfilled', 'completed', 'dispatched'] } },
        { fulfillment_status: 'fulfilled' },
      ],
    };
  } else if (s === 'cancelled') {
    condition = {
      $or: [
        { status: { $in: ['cancelled', 'voided'] } },
        { fulfillment_status: 'cancelled' },
      ],
    };
  } else {
    condition = { status: s };
  }

  if (query.$or) {
    query.$and = [{ $or: query.$or }, condition];
    delete query.$or;
  } else if (query.$and) {
    query.$and.push(condition);
  } else {
    Object.assign(query, condition);
  }
}
