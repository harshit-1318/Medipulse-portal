import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSurveyFilters, type UseSurveyFiltersProps } from '../hooks/useSurveyFilters';

const makeProps = (overrides: Partial<UseSurveyFiltersProps> = {}): UseSurveyFiltersProps => {
    return {
        filters: { search: '', status: '', sortBy: 'createdAt', sort: 'desc' },
        setFilters: vi.fn() as any,
        setPage: vi.fn(),
        setFiltersEnabled: vi.fn(),
        ...overrides
    };
};

describe('useSurveyFilters', () => {
    describe('initial state', () => {
        it('initialises localSearch from filters.search', () => {
            const props = makeProps({ filters: { search: 'hello', status: '', sortBy: 'createdAt', sort: 'desc' } });
            const { result } = renderHook(() => useSurveyFilters(props));
            expect(result.current.localSearch).toBe('hello');
        });

        it('initialises localStatus from filters.status', () => {
            const props = makeProps({ filters: { search: '', status: 'published', sortBy: 'createdAt', sort: 'desc' } });
            const { result } = renderHook(() => useSurveyFilters(props));
            expect(result.current.localStatus).toBe('published');
        });
    });

    describe('handleApply', () => {
        it('resets page to 1 and calls setFilters with local values', () => {
            const props = makeProps();
            const { result } = renderHook(() => useSurveyFilters(props));
            act(() => result.current.setLocalSearch('test query'));
            act(() => result.current.handleApply());
            expect(props.setPage).toHaveBeenCalledWith(1);
            expect(props.setFilters).toHaveBeenCalled();
        });

        it('closes the filter panel', () => {
            const props = makeProps();
            const { result } = renderHook(() => useSurveyFilters(props));
            act(() => result.current.handleApply());
            expect(props.setFiltersEnabled).toHaveBeenCalledWith(false);
        });
    });

    describe('clearFilters', () => {
        it('resets local state to empty strings', () => {
            const props = makeProps({ filters: { search: 'x', status: 'draft', sortBy: 'createdAt', sort: 'desc' } });
            const { result } = renderHook(() => useSurveyFilters(props));
            act(() => result.current.clearFilters());
            expect(result.current.localSearch).toBe('');
            expect(result.current.localStatus).toBe('');
        });

        it('calls setFilters with empty/default payload', () => {
            const props = makeProps();
            const { result } = renderHook(() => useSurveyFilters(props));
            act(() => result.current.clearFilters());
            expect(props.setFilters).toHaveBeenCalledWith({ search: '', status: '', sortBy: 'createdAt', sort: 'desc' });
        });

        it('resets page to 1', () => {
            const props = makeProps();
            const { result } = renderHook(() => useSurveyFilters(props));
            act(() => result.current.clearFilters());
            expect(props.setPage).toHaveBeenCalledWith(1);
        });
    });

    describe('removeFilter', () => {
        it('clears search filter and resets local search', () => {
            const props = makeProps({ filters: { search: 'Alice', status: '', sortBy: 'createdAt', sort: 'desc' } });
            const { result } = renderHook(() => useSurveyFilters(props));
            act(() => result.current.removeFilter('search'));
            expect(result.current.localSearch).toBe('');
        });

        it('clears status filter and resets local status', () => {
            const props = makeProps({ filters: { search: '', status: 'published', sortBy: 'createdAt', sort: 'desc' } });
            const { result } = renderHook(() => useSurveyFilters(props));
            act(() => result.current.removeFilter('status'));
            expect(result.current.localStatus).toBe('');
        });
    });

    describe('activeFilterChips', () => {
        it('returns empty array when no filters are active', () => {
            const props = makeProps();
            const { result } = renderHook(() => useSurveyFilters(props));
            expect(result.current.activeFilterChips).toHaveLength(0);
        });

        it('returns a chip for active search filter', () => {
            const props = makeProps({ filters: { search: 'Bob', status: '', sortBy: 'createdAt', sort: 'desc' } });
            const { result } = renderHook(() => useSurveyFilters(props));
            const chips = result.current.activeFilterChips;
            expect(chips).toHaveLength(1);
            expect(chips[0]).toMatchObject({ key: 'search', value: 'Bob' });
        });

        it('returns a chip for active status filter', () => {
            const props = makeProps({ filters: { search: '', status: 'published', sortBy: 'createdAt', sort: 'desc' } });
            const { result } = renderHook(() => useSurveyFilters(props));
            const chips = result.current.activeFilterChips;
            expect(chips).toHaveLength(1);
            expect(chips[0]).toMatchObject({ key: 'status', value: 'published' });
        });

        it('returns two chips when both filters are active', () => {
            const props = makeProps({ filters: { search: 'query', status: 'draft', sortBy: 'createdAt', sort: 'desc' } });
            const { result } = renderHook(() => useSurveyFilters(props));
            expect(result.current.activeFilterChips).toHaveLength(2);
        });
    });
});
