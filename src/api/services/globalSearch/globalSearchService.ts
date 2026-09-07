import { apiClient } from '@/api/apiClient';
import type { GlobalSearchResponse } from '@/types/globalSearch';

const EMPTY_RESULT: GlobalSearchResponse = { orders: [], customers: [] };

/**
 * Global content search.
 *
 * Pattern detection is handled on the backend:
 * - All digits → search by shopify_order_id / customer_id
 * - Contains @ → search by customer email
 * - Starts with # → search by order_name
 * - Anything else → partial text search on order_name, email, customer name
 *
 * Results are grouped by type with exact matches before partial matches.
 */
export async function globalSearch(q: string): Promise<GlobalSearchResponse> {
  if (q.trim().length < 2) {
    return EMPTY_RESULT;
  }

  try {
    const result = await apiClient.get<GlobalSearchResponse>('/global-search', {
      params: { q: q.trim() },
    });
    return result ?? EMPTY_RESULT;
  } catch {
    return EMPTY_RESULT;
  }
}
