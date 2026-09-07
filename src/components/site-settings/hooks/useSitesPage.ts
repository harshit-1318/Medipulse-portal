import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSites } from '@/api/services/site/siteService';
import type { SiteFiltersState } from '@/types/site';
import type { SortingState } from "@tanstack/react-table";
import { useDebounce } from '@/hooks';

export function useSitesPage() {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filtersEnabled, setFiltersEnabled] = useState(false);
    
    const [filters, setFilters] = useState<SiteFiltersState>({
        search: "",
        status: "all",
        siteName: "",
        url: "",
        startDate: "",
        endDate: ""
    });

    const debouncedFilters = useDebounce(filters, 500);

    // React Query for data fetching
    const { data, isLoading: loading } = useQuery({
        queryKey: ['sites', page, sorting, debouncedFilters],
        queryFn: () => {
            const firstSort = sorting[0];
            const sortBy = firstSort?.id || "";
            const sort = firstSort?.desc ? "desc" : "asc";
            
            return getSites(page, debouncedFilters.search, sortBy, sort, {
                status: debouncedFilters.status,
                siteName: debouncedFilters.siteName,
                url: debouncedFilters.url,
                startDate: debouncedFilters.startDate,
                endDate: debouncedFilters.endDate
            });
        },
        placeholderData: (previousData) => previousData,
    });

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "all",
            siteName: "",
            url: "",
            startDate: "",
            endDate: ""
        });
        setPage(1);
    };

    return { 
        data, 
        loading, 
        page, 
        setPage, 
        sorting, 
        setSorting,
        filtersEnabled, 
        setFiltersEnabled, 
        filters, 
        setFilters,
        clearFilters
    };
}
