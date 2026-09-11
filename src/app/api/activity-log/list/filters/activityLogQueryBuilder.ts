export function buildActivityLogQuery(searchParams: URLSearchParams) {
  const roleParam = searchParams.get('role')?.toLowerCase().trim() || '';
  const searchParam = searchParams.get('search')?.trim() || '';
  const actionParam = (searchParams.get('action') || searchParams.get('action_type'))?.toLowerCase().trim() || '';
  const orderIdParam = (searchParams.get('orderId') || searchParams.get('subject_guid') || searchParams.get('target_guid'))?.trim() || '';
  const viewParam = (searchParams.get('view') || searchParams.get('pageName') || searchParams.get('page_name'))?.toLowerCase().trim() || '';
  const siteIdParam = (searchParams.get('siteId') || searchParams.get('site_guid'))?.trim() || '';
  const startDateParam = searchParams.get('startDate') || searchParams.get('start_date') || '';
  const endDateParam = searchParams.get('endDate') || searchParams.get('end_date') || '';

  const andConditions: any[] = [];

  if (roleParam) {
    andConditions.push({ $or: [{ role: roleParam }, { user_role: roleParam }] });
  }

  if (actionParam) {
    andConditions.push({ $or: [{ action: actionParam }, { action_type: actionParam }] });
  }

  if (orderIdParam) {
    andConditions.push({
      $or: [
        { orderId: { $regex: orderIdParam, $options: 'i' } },
        { object_guid: { $regex: orderIdParam, $options: 'i' } },
        { target_guid: { $regex: orderIdParam, $options: 'i' } },
      ],
    });
  }

  if (viewParam) {
    andConditions.push({ $or: [{ page: viewParam }, { view: viewParam }] });
  }

  if (siteIdParam) {
    andConditions.push({ $or: [{ site_id: siteIdParam }, { siteName: siteIdParam }] });
  }

  if (startDateParam || endDateParam) {
    const dateQuery: any = {};
    if (startDateParam) {
      const start = new Date(startDateParam);
      if (!isNaN(start.getTime())) {
        start.setUTCHours(0, 0, 0, 0);
        dateQuery.$gte = start;
      }
    }
    if (endDateParam) {
      const end = new Date(endDateParam);
      if (!isNaN(end.getTime())) {
        end.setUTCHours(23, 59, 59, 999);
        dateQuery.$lte = end;
      }
    }
    if (Object.keys(dateQuery).length > 0) {
      andConditions.push({ createdAt: dateQuery });
    }
  }

  if (searchParam) {
    andConditions.push({
      $or: [
        { user: { $regex: searchParam, $options: 'i' } },
        { user_name: { $regex: searchParam, $options: 'i' } },
        { user_email: { $regex: searchParam, $options: 'i' } },
        { details: { $regex: searchParam, $options: 'i' } },
      ],
    });
  }

  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  // Resolve sort
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = (searchParams.get('sortDir') || searchParams.get('sort') || 'desc').toLowerCase();
  const dirMultiplier: 1 | -1 = sortDir === 'asc' ? 1 : -1;

  let sortField = 'createdAt';
  if (sortBy === 'action' || sortBy === 'action_type') sortField = 'action';
  else if (sortBy === 'user' || sortBy === 'user_email') sortField = 'user_email';
  else if (sortBy === 'orderId' || sortBy === 'object_guid') sortField = 'orderId';
  else if (sortBy === 'view' || sortBy === 'page') sortField = 'view';

  const sort: Record<string, 1 | -1> = { [sortField]: dirMultiplier };

  return { query, sort };
}
