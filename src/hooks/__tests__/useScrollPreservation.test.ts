import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollPreservation } from '../navigation/useScrollPreservation';

describe('useScrollPreservation', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('returns a containerRef object', () => {
        const { result } = renderHook(() => useScrollPreservation('orders_table', true));
        expect(result.current).toBeDefined();
        expect(result.current.current).toBeNull();
    });

    it('does not throw when loading changes to false with no saved position', () => {
        const { result, rerender } = renderHook(
            ({ loading }) => useScrollPreservation('orders_table', loading),
            { initialProps: { loading: true } }
        );

        expect(() => rerender({ loading: false })).not.toThrow();
        expect(result.current).toBeDefined();
    });
});
