import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPrescriptions } from '../prescriptionService';
import apiClient from '@/api/apiClient';

vi.mock('@/api/apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('prescriptionService.getPrescriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches default prescription list without filters', async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      total: 2,
      prescriptions: [{ id: 'rx-1' }, { id: 'rx-2' }],
    });

    const res = await getPrescriptions(1, 20, {});
    expect(apiClient.get).toHaveBeenCalledWith({
      url: '/orders/prescription-list',
      method: 'GET',
      params: {
        page: 1,
        limit: 20,
        sort: 'desc',
      },
    });
    expect(res.total).toBe(2);
    expect(res.prescriptions).toHaveLength(2);
  });

  it('normalizes sort direction through normalizeSortOrder', async () => {
    (apiClient.get as any).mockResolvedValueOnce({ total: 0, prescriptions: [] });

    await getPrescriptions(1, 20, { sort: 'ASCENDING' });
    expect(apiClient.get).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          sort: 'asc',
        }),
      })
    );
  });

  it('switches to /orders/search and preserves both orderDate and reviewDate separately', async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      total: 1,
      prescriptions: [{ id: 'rx-100' }],
    });

    const filters = {
      orderId: ' #MP-10797 ',
      customerId: ' 657339 ',
      prescriber: ' Dr. Sarah Jenkins ',
      startDate: '2026-09-09',
      reviewStartDate: '2026-09-10',
      sortBy: 'orderDate',
      sort: 'asc',
    };

    const res = await getPrescriptions(1, 20, filters);
    expect(apiClient.get).toHaveBeenCalledWith({
      url: '/orders/search',
      method: 'GET',
      params: {
        type: 'prescriptions',
        page: 1,
        limit: 20,
        sort: 'asc',
        sortBy: 'orderDate',
        orderId: '#MP-10797',
        customerId: '657339',
        prescriber: 'Dr. Sarah Jenkins',
        orderDate: '2026-09-09',
        reviewDate: '2026-09-10',
      },
    });
    expect(res.total).toBe(1);
    expect(res.prescriptions[0].id).toBe('rx-100');
  });

  it('handles API failure gracefully and returns empty list', async () => {
    (apiClient.get as any).mockRejectedValueOnce(new Error('Network failure'));

    const res = await getPrescriptions(1, 20, {});
    expect(res).toEqual({
      total: 0,
      page: 1,
      limit: 20,
      prescriptions: [],
    });
  });
});
