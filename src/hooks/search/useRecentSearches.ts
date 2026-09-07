import { useState, useCallback } from 'react';

const STORAGE_KEY = 'global-search-recent';
const MAX_RECENTS = 8;

export interface RecentSearch {
    query: string;
    timestamp: number;
}

function readFromStorage(): RecentSearch[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as RecentSearch[];
    } catch {
        return [];
    }
}

function writeToStorage(items: RecentSearch[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function clearRecentSearches(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
}

export function useRecentSearches() {
    const [recents, setRecents] = useState<RecentSearch[]>(readFromStorage);

    const addRecent = useCallback((query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        setRecents((prev) => {
            // Remove duplicate if same query already exists, then prepend
            const deduped = prev.filter(
                (r) => r.query.toLowerCase() !== trimmed.toLowerCase(),
            );
            const updated = [
                { query: trimmed, timestamp: Date.now() },
                ...deduped,
            ].slice(0, MAX_RECENTS);
            writeToStorage(updated);
            return updated;
        });
    }, []);

    const removeRecent = useCallback((query: string) => {
        setRecents((prev) => {
            const updated = prev.filter((r) => r.query !== query);
            writeToStorage(updated);
            return updated;
        });
    }, []);

    const clearAll = useCallback(() => {
        clearRecentSearches();
        setRecents([]);
    }, []);

    return {
        recents,
        addRecent,
        removeRecent,
        clearAll,
    };
}
