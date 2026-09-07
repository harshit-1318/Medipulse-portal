import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPrescriptions } from '@/api/services/prescription/prescriptionService';
import type { SortingState } from "@tanstack/react-table";
import { usePrescriptionFilters } from './usePrescriptionFilters';
import { useUrlSync } from '@/hooks';
import { getInitialOrderFilters, getUrlParamInt, getDashboardStorageKey } from '@/utils/url';

const DEFAULT_FILTERS = {
    orderId: "", 
    prescriber: "", 
    customerId: "",
    startDate: "", 
    endDate: "",
    reviewStartDate: "", 
    reviewEndDate: "",
    sortBy: "", 
    sort: "asc"
};

export function usePrescriptionsPage() {
    const storageKey = getDashboardStorageKey("prescriptions");
    const [page, setPage] = useState(() => getUrlParamInt("page", 1, storageKey));
    
    const initialFilters = getInitialOrderFilters(DEFAULT_FILTERS as any, storageKey);
    const [filters, setFilters] = useState(initialFilters);
    
    // Initialize sorting from initial filters
    const [sorting, setSorting] = useState<SortingState>(() => {
        if (initialFilters.sortBy) {
            return [{ id: initialFilters.sortBy, desc: initialFilters.sort === 'desc' }];
        }
        return [];
    });
    
    const [filtersEnabled, setFiltersEnabled] = useState(false);

    const filterHelpers = usePrescriptionFilters(filters, setFilters, setPage);

    /* -------------------- URL Sync -------------------- */
    useUrlSync(filters, setFilters, page, setPage, storageKey, DEFAULT_FILTERS as any);

    // React Query for data fetching
    const { data, isLoading: loading } = useQuery({
        queryKey: ['prescriptions', page, filters],
        queryFn: () => getPrescriptions(page, 20, filters),
        placeholderData: (previousData) => previousData,
    });

    // Handle internal sorting state change -> sync to filters
    useEffect(() => {
        const firstSort = sorting[0];
        if (firstSort) {
            const newSortBy = firstSort.id;
            const newSortOrder = firstSort.desc ? "desc" : "asc";
            
            if (filters.sortBy !== newSortBy || filters.sort !== newSortOrder) {
                setFilters(prev => ({ ...prev, sortBy: newSortBy, sort: newSortOrder as any }));
                setPage(1);
            }
        } else {
            if (filters.sortBy !== DEFAULT_FILTERS.sortBy || filters.sort !== DEFAULT_FILTERS.sort) {
                setFilters(prev => ({ ...prev, sortBy: DEFAULT_FILTERS.sortBy, sort: DEFAULT_FILTERS.sort as any }));
            }
        }
    }, [sorting]);

    // Handle filters change -> sync back to sorting state if needed (e.g. on initial load or back navigation)
    useEffect(() => {
        if (filters.sortBy) {
            const currentSort = sorting[0];
            const shouldUpdate = !currentSort || 
                               currentSort.id !== filters.sortBy || 
                               (currentSort.desc && filters.sort === 'asc') || 
                               (!currentSort.desc && filters.sort === 'desc');
            
            if (shouldUpdate) {
                setSorting([{ id: filters.sortBy, desc: filters.sort === 'desc' }]);
            }
        }
    }, [filters.sortBy, filters.sort]);

    return { 
        data, loading, page, setPage, sorting, setSorting,
        filtersEnabled, setFiltersEnabled, filters, setFilters,
        ...filterHelpers
    };
}
