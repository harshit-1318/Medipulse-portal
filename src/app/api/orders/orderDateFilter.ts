export function parseDateBoundary(dateStr: string, isEnd = false): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const clean = dateStr.trim().replace(/\//g, '-');
  if (!clean) return null;
  const datePart = clean.split('T')[0];
  const parts = datePart.split('-').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    let [year, month, day] = parts;
    if (parts[0] <= 31 && parts[2] > 1000) {
      [day, month, year] = parts;
    }
    const d = isEnd
      ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
      : new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    return isNaN(d.getTime()) ? null : d;
  }
  const fallback = new Date(clean);
  if (!isNaN(fallback.getTime())) {
    return isEnd
      ? new Date(Date.UTC(fallback.getUTCFullYear(), fallback.getUTCMonth(), fallback.getUTCDate(), 23, 59, 59, 999))
      : new Date(Date.UTC(fallback.getUTCFullYear(), fallback.getUTCMonth(), fallback.getUTCDate(), 0, 0, 0, 0));
  }
  return null;
}

export function applyDateFilter(query: Record<string, any>, searchParams: URLSearchParams): void {
  const startDate = searchParams.get('startDate') || searchParams.get('start_date');
  const endDate = searchParams.get('endDate') || searchParams.get('end_date');
  if (!startDate && !endDate) return;

  const startParsed = startDate ? parseDateBoundary(startDate, false) : null;
  const endParsed = endDate ? parseDateBoundary(endDate, true) : null;

  if ((startDate && !startParsed) || (endDate && !endParsed)) {
    query.createdAt = { $gt: new Date('9999-12-31') };
    return;
  }

  const range: Record<string, Date> = {};
  if (startParsed) range.$gte = startParsed;
  if (endParsed) range.$lte = endParsed;

  if (Object.keys(range).length > 0) {
    query.createdAt = range;
  }
}

