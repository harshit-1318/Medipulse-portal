import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUrlSync } from '../url/useUrlSync';

describe('useUrlSync', () => {
    let replaceStateSpy: any;

    beforeEach(() => {
        replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});
        localStorage.clear();
    });

    it('does not push URL params on first render', () => {
        const onUrlStateChange = vi.fn();
        renderHook(() =>
            useUrlSync({ search: 'test' }, onUrlStateChange, 1, undefined, undefined, undefined, true)
        );

        expect(replaceStateSpy).not.toHaveBeenCalled();
    });

    it('syncs state to URLSearchParams on subsequent state updates', () => {
        replaceStateSpy.mockClear();
        const onUrlStateChange = vi.fn();
        const { rerender } = renderHook(
            ({ state }) => useUrlSync(state, onUrlStateChange, 1, undefined, 'test-storage', undefined, true),
            { initialProps: { state: { status: 'all' } } }
        );

        rerender({ state: { status: 'fulfilled' } });

        expect(replaceStateSpy).toHaveBeenCalled();
        const calledUrl = replaceStateSpy.mock.calls[replaceStateSpy.mock.calls.length - 1][2];
        expect(calledUrl).toContain('status=fulfilled');
    });

    it('omits default values and handles page parameter', () => {
        replaceStateSpy.mockClear();
        const onUrlStateChange = vi.fn();
        const defaults = { status: 'all', limit: '20' };

        const { rerender } = renderHook(
            ({ state, page }) => useUrlSync(state, onUrlStateChange, page, undefined, undefined, defaults, true),
            { initialProps: { state: { status: 'all', limit: '20' }, page: 1 } }
        );

        rerender({ state: { status: 'urgent', limit: '20' }, page: 2 });

        expect(replaceStateSpy).toHaveBeenCalled();
        const calledUrl = replaceStateSpy.mock.calls[replaceStateSpy.mock.calls.length - 1][2];
        expect(calledUrl).toContain('status=urgent');
        expect(calledUrl).toContain('page=2');
        expect(calledUrl).not.toContain('limit');
    });

    it('syncs from URL on popstate event', () => {
        const onUrlStateChange = vi.fn();
        const state = { customer: '' };

        renderHook(() =>
            useUrlSync(state, onUrlStateChange, 1, undefined, undefined, undefined, true)
        );

        // Simulate popstate with query
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                ...window.location,
                search: '?customer=Alice',
                pathname: '/orders'
            }
        });

        window.dispatchEvent(new Event('popstate'));

        expect(onUrlStateChange).toHaveBeenCalledWith(
            expect.objectContaining({ customer: 'Alice' })
        );
    });
});
