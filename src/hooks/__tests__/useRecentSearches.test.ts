import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecentSearches, clearRecentSearches } from '../search/useRecentSearches';

describe('useRecentSearches', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('initializes with an empty array when localStorage is empty', () => {
        const { result } = renderHook(() => useRecentSearches());
        expect(result.current.recents).toEqual([]);
    });

    it('adds recent search query and trims whitespace', () => {
        const { result } = renderHook(() => useRecentSearches());

        act(() => {
            result.current.addRecent('  aspirin  ');
        });

        expect(result.current.recents).toHaveLength(1);
        expect(result.current.recents[0].query).toBe('aspirin');
    });

    it('does not add empty or whitespace-only queries', () => {
        const { result } = renderHook(() => useRecentSearches());

        act(() => {
            result.current.addRecent('   ');
        });

        expect(result.current.recents).toEqual([]);
    });

    it('deduplicates case-insensitively and puts latest at top', () => {
        const { result } = renderHook(() => useRecentSearches());

        act(() => {
            result.current.addRecent('Aspirin');
            result.current.addRecent('Ibuprofen');
            result.current.addRecent('aspirin');
        });

        expect(result.current.recents).toHaveLength(2);
        expect(result.current.recents[0].query).toBe('aspirin');
        expect(result.current.recents[1].query).toBe('Ibuprofen');
    });

    it('removes a specific recent search', () => {
        const { result } = renderHook(() => useRecentSearches());

        act(() => {
            result.current.addRecent('Alpha');
            result.current.addRecent('Beta');
        });

        act(() => {
            result.current.removeRecent('Alpha');
        });

        expect(result.current.recents.map(r => r.query)).toEqual(['Beta']);
    });

    it('clears all recent searches', () => {
        const { result } = renderHook(() => useRecentSearches());

        act(() => {
            result.current.addRecent('Alpha');
            result.current.addRecent('Beta');
        });

        act(() => {
            result.current.clearAll();
        });

        expect(result.current.recents).toEqual([]);
        expect(localStorage.getItem('global-search-recent')).toBeNull();
    });
});
