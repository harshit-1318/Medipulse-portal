import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollPreservation } from '../navigation/useScrollPreservation';

describe('useScrollPreservation', () => {
    beforeEach(() => {
        sessionStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns a containerRef object', () => {
        const { result } = renderHook(() => useScrollPreservation('orders_table', true));
        expect(result.current).toBeDefined();
        expect(result.current.current).toBeNull();
    });

    it('restores saved scroll position when loading completes', () => {
        sessionStorage.setItem('scroll_pos_orders_table', '350');

        const mockDiv = document.createElement('div');
        const scrollToSpy = vi.fn();
        mockDiv.scrollTo = scrollToSpy;

        const { result, rerender } = renderHook(
            ({ loading }) => useScrollPreservation('orders_table', loading),
            { initialProps: { loading: true } }
        );

        // Attach mock DOM element
        (result.current as any).current = mockDiv;

        rerender({ loading: false });

        act(() => {
            vi.runAllTimers();
        });

        expect(scrollToSpy).toHaveBeenCalledWith({ top: 350, behavior: 'instant' });
    });

    it('saves scroll position when element scrolls and on unmount', () => {
        const mockDiv = document.createElement('div');
        Object.defineProperty(mockDiv, 'scrollTop', { value: 180, writable: true });

        const { result, unmount } = renderHook(() => useScrollPreservation('orders_table', false));

        (result.current as any).current = mockDiv;

        // Re-trigger effect that adds scroll listener with the attached ref
        const scrollEvent = new Event('scroll');
        Object.defineProperty(scrollEvent, 'target', { value: mockDiv });
        mockDiv.dispatchEvent(scrollEvent);

        unmount();

        expect(sessionStorage.getItem('scroll_pos_orders_table')).toBe('180');
    });
});
