import { useState, useCallback, useEffect } from 'react';
import type { SurveyFilters } from '@/types/survey';

export interface UseSurveyFiltersProps {
    filters: SurveyFilters;
    setFilters: React.Dispatch<React.SetStateAction<SurveyFilters>>;
    setPage: (n: number) => void;
    setFiltersEnabled: (v: boolean) => void;
}

export function useSurveyFilters({
    filters,
    setFilters,
    setPage,
    setFiltersEnabled,
}: UseSurveyFiltersProps) {
    const [localSearch, setLocalSearch] = useState(filters.search || '');
    const [localStatus, setLocalStatus] = useState(filters.status || '');

    useEffect(() => {
        setLocalSearch(filters.search || '');
        setLocalStatus(filters.status || '');
    }, [filters.search, filters.status]);

    const handleApply = useCallback(() => {
        setPage(1);
        setFilters(prev => ({ ...prev, search: localSearch, status: localStatus as any }));
        setFiltersEnabled(false);
    }, [localSearch, localStatus, setFilters, setPage, setFiltersEnabled]);

    const clearFilters = useCallback(() => {
        setPage(1);
        setLocalSearch('');
        setLocalStatus('');
        setFilters({ search: '', status: '', sortBy: 'createdAt', sort: 'desc' });
        setFiltersEnabled(false);
    }, [setFilters, setPage, setFiltersEnabled]);

    const updateFilter = useCallback((key: string, value: any) => {
        setPage(1);
        setFilters(prev => ({ ...prev, [key]: value }));
        if (key === 'search') setLocalSearch(value);
        if (key === 'status') setLocalStatus(value);
    }, [setFilters, setPage]);

    const activeFilterChips = [
        ...(filters.search ? [{ key: 'search', label: 'Search', value: filters.search }] : []),
        ...(filters.status ? [{ key: 'status', label: 'Status', value: filters.status }] : []),
    ];

    const removeFilter = useCallback((key: string) => {
        if (key === 'search') setLocalSearch('');
        if (key === 'status') setLocalStatus('');
        updateFilter(key, '');
    }, [updateFilter]);

    return {
        localSearch, setLocalSearch,
        localStatus, setLocalStatus,
        handleApply, clearFilters, updateFilter,
        activeFilterChips, removeFilter,
    };
}
