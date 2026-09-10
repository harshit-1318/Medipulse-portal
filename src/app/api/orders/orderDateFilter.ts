export function parseDateBoundary(dateStr: string, isEnd = false): Date {
  const clean = dateStr.trim().replace(/\//g, '-');
  const datePart = clean.split('T')[0];
  const parts = datePart.split('-').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    let [year, month, day] = parts;
    if (parts[0] <= 31 && parts[2] > 1000) {
      [day, month, year] = parts;
    }
    return isEnd
      ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
      : new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  }
  const fallback = new Date(clean);
  if (!isNaN(fallback.getTime())) {
    return isEnd
      ? new Date(Date.UTC(fallback.getUTCFullYear(), fallback.getUTCMonth(), fallback.getUTCDate(), 23, 59, 59, 999))
      : new Date(Date.UTC(fallback.getUTCFullYear(), fallback.getUTCMonth(), fallback.getUTCDate(), 0, 0, 0, 0));
  }
  return fallback;
}

export function applyDateFilter(query: Record<string, any>, searchParams: URLSearchParams): void {
  const startDate = searchParams.get('startDate') || searchParams.get('start_date');
  const endDate = searchParams.get('endDate') || searchParams.get('end_date');
  if (!startDate && !endDate) return;

  query.createdAt = {};
  if (startDate) query.createdAt.$gte = parseDateBoundary(startDate, false);
  if (endDate) query.createdAt.$lte = parseDateBoundary(endDate, true);
}
