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
        const onUrlStateChange = vi.fn();
        const { rerender } = renderHook(
            ({ state }) => useUrlSync(state, onUrlStateChange, 1, undefined, 'test-storage', undefined, true),
            { initialProps: { state: { status: 'all' } } }
        );

        rerender({ state: { status: 'fulfilled' } });

        expect(replaceStateSpy).toHaveBeenCalled();
        const calledUrl = replaceStateSpy.mock.calls[0][2];
        expect(calledUrl).toContain('status=fulfilled');
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
