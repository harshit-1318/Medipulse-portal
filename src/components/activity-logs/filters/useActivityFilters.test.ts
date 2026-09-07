import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActivityFilters } from './useActivityFilters';

describe('useActivityFilters', () => {
    const setPage = vi.fn();
    const setFilters = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('includes Site chip label from site options when site filter is active', () => {
        const filters = {
            siteId: 'site_1',
            search: '',
            orderId: '',
            action: '',
            view: '',
            startDate: '',
            endDate: '',
        };

        const { result } = renderHook(() =>
            useActivityFilters(filters, setFilters, setPage, [
                { label: 'All Sites', value: '' },
                { label: 'Clinic A', value: 'site_1' },
            ]),
        );

        expect(result.current.activeFilters).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ key: 'siteId', label: 'Site', value: 'Clinic A' }),
            ]),
        );
    });

    it('clearFilters resets siteId along with other filter fields', () => {
        const filters = {
            siteId: 'site_1',
            search: 'abc',
            orderId: '100',
            action: 'email_sent',
            view: 'orders',
            startDate: '2026-01-01',
            endDate: '2026-01-31',
        };

        const { result } = renderHook(() => useActivityFilters(filters, setFilters, setPage, []));

        act(() => {
            result.current.clearFilters();
        });

        expect(setPage).toHaveBeenCalledWith(1);
        expect(setFilters).toHaveBeenCalledWith({
            siteId: '',
            search: '',
            orderId: '',
            action: '',
            view: '',
            startDate: '',
            endDate: '',
        });
    });
});
