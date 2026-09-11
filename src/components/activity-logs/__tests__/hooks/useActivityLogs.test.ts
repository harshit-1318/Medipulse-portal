import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import * as logService from '@/api/services/log/logService';

vi.mock('@/api/services/log/logService', () => ({
    getActivityLogs: vi.fn().mockResolvedValue({
        activityLogs: [],
        total: 0,
        page: 1,
        limit: 20,
    }),
}));

describe('useActivityLogs Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        window.history.replaceState({}, '', '/activity-logs');
    });

    it('initializes page to 1 by default to prevent SSR hydration mismatch', async () => {
        const { result } = renderHook(() => useActivityLogs());

        expect(result.current.page).toBe(1);
        expect(result.current.filters.role).toBe('');

        await waitFor(() => {
            expect(logService.getActivityLogs).toHaveBeenCalled();
        });
    });

    it('hydrates page from URL search parameters on mount', async () => {
        window.history.replaceState({}, '', '/activity-logs?page=3');

        const { result } = renderHook(() => useActivityLogs());

        await waitFor(() => {
            expect(result.current.page).toBe(3);
        });
    });

    it('updates page when setPage is called', async () => {
        const { result } = renderHook(() => useActivityLogs());

        await waitFor(() => {
            expect(logService.getActivityLogs).toHaveBeenCalled();
        });

        act(() => {
            result.current.setPage(2);
        });

        expect(result.current.page).toBe(2);

        await waitFor(() => {
            expect(logService.getActivityLogs).toHaveBeenCalledWith(2, 20, expect.any(Object));
        });
    });
});
