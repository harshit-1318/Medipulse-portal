import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks';
import { useRecentSearches } from '@/hooks';
import { globalSearch } from '@/api/services/globalSearch/globalSearchService';
import type { GlobalSearchResponse } from '@/types/globalSearch';

export function useGlobalSearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<GlobalSearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMac, setIsMac] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedQuery = useDebounce(searchQuery, 350);
    const { recents, addRecent, removeRecent, clearAll } = useRecentSearches();

    const handleSelect = () => {
        if (debouncedQuery.trim().length >= 2 && results &&
            (results.orders.length > 0 || results.customers.length > 0)) {
            addRecent(debouncedQuery.trim());
        }
        setIsOpen(false);
    };

    const handleRecentClick = (query: string) => {
        setSearchQuery(query);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    useEffect(() => {
        setMounted(true);
        setIsMac(navigator.userAgent.includes('Mac'));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setSearchQuery('');
            setResults(null);
        }
    }, [isOpen]);

    useEffect(() => {
        if (debouncedQuery.trim().length < 2) {
            setResults(null);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        globalSearch(debouncedQuery).then((data) => {
            if (!cancelled) {
                setResults(data);
                setIsLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    return {
        isOpen,
        setIsOpen,
        searchQuery,
        setSearchQuery,
        results,
        isLoading,
        mounted,
        isMac,
        inputRef,
        recents,
        handleSelect,
        handleRecentClick,
        removeRecent,
        clearAll,
    };
}
