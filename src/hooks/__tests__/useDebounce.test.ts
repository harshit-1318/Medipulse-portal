import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../timing/useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 500));
        expect(result.current).toBe('hello');
    });

    it('updates the debounced value after the specified delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        rerender({ value: 'updated', delay: 500 });
        expect(result.current).toBe('initial');

        act(() => {
            vi.advanceTimersByTime(499);
        });
        expect(result.current).toBe('initial');

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(result.current).toBe('updated');
    });

    it('cancels pending update if value changes again within delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'first', delay: 300 } }
        );

        rerender({ value: 'second', delay: 300 });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current).toBe('first');

        rerender({ value: 'third', delay: 300 });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current).toBe('first');

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(result.current).toBe('third');
    });
});
