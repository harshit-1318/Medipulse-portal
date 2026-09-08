import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSurveyFilters, type UseSurveyFiltersProps } from '../hooks/useSurveyFilters';
import type { SurveyFilters } from '@/types/survey';

const defFilters: SurveyFilters = { search: '', status: '', sortBy: 'createdAt', sort: 'desc' };
const makeProps = (overrides: Partial<UseSurveyFiltersProps> = {}): UseSurveyFiltersProps => ({
    filters: { ...defFilters },
    setFilters: vi.fn() as any,
    setPage: vi.fn(),
    setFiltersEnabled: vi.fn(),
    ...overrides,
});

describe('useSurveyFilters', () => {
    it('initialises local state from props', () => {
        const { result } = renderHook(() => useSurveyFilters(makeProps({ filters: { ...defFilters, search: 'hi', status: 'published' } })));
        expect(result.current.localSearch).toBe('hi');
        expect(result.current.localStatus).toBe('published');
    });

    it('handles handleApply: resets page to 1, calls setFilters, and closes panel', () => {
        const props = makeProps();
        const { result } = renderHook(() => useSurveyFilters(props));
        act(() => {
            result.current.setLocalSearch('test query');
            result.current.handleApply();
        });
        expect(props.setPage).toHaveBeenCalledWith(1);
        expect(props.setFilters).toHaveBeenCalled();
        expect(props.setFiltersEnabled).toHaveBeenCalledWith(false);
    });

    it('resets local and filter state in clearFilters', () => {
        const props = makeProps({ filters: { ...defFilters, search: 'x', status: 'draft' } });
        const { result } = renderHook(() => useSurveyFilters(props));
        act(() => result.current.clearFilters());
        expect(result.current.localSearch).toBe('');
        expect(result.current.localStatus).toBe('');
        expect(props.setFilters).toHaveBeenCalledWith(defFilters);
        expect(props.setPage).toHaveBeenCalledWith(1);
    });

    it('clears individual filters with removeFilter', () => {
        const props = makeProps({ filters: { ...defFilters, search: 'Alice', status: 'published' } });
        const { result } = renderHook(() => useSurveyFilters(props));
        act(() => result.current.removeFilter('search'));
        expect(result.current.localSearch).toBe('');
        act(() => result.current.removeFilter('status'));
        expect(result.current.localStatus).toBe('');
    });

    describe('activeFilterChips', () => {
        it('returns chips only for active filters', () => {
            const empty = renderHook(() => useSurveyFilters(makeProps())).result.current.activeFilterChips;
            expect(empty).toHaveLength(0);

            const withSearch = renderHook(() => useSurveyFilters(makeProps({ filters: { ...defFilters, search: 'Bob' } }))).result.current.activeFilterChips;
            expect(withSearch[0]).toMatchObject({ key: 'search', value: 'Bob' });

            const withBoth = renderHook(() => useSurveyFilters(makeProps({ filters: { ...defFilters, search: 'q', status: 'draft' } }))).result.current.activeFilterChips;
            expect(withBoth).toHaveLength(2);
        });
    });
});
