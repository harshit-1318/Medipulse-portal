import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '@/api/services/customer';
import { useCustomerFilters } from './useCustomerFilters';
import { useUrlSync } from '@/hooks';
import type { SortingState } from "@tanstack/react-table";

export function useCustomersPage(initialData: any = null, initialFilters: any = {}) {
    const safeInitialFilters = initialFilters || {};
    const [page, setPage] = useState(safeInitialFilters.page || 1);
    const [filters, setFilters] = useState(safeInitialFilters);
    const [filtersEnabled, setFiltersEnabled] = useState(false);

    // 🔄 Sync state with URL using existing utility
    useUrlSync(filters, setFilters, page, setPage, "customer-filters", safeInitialFilters);

    // 🧩 Derive sorting state for the table UI from filters
    const sorting = useMemo<SortingState>(() => {
        return filters?.sortBy ? [{ id: filters.sortBy, desc: filters.sort === 'desc' }] : [];
    }, [filters?.sortBy, filters?.sort]);

    const filterHelpers = useCustomerFilters(filters, setFilters, (p: number) => setPage(p), setFiltersEnabled);

    // 📡 TanStack Query for dynamic XHR data fetching
    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['customers', page, filters],
        queryFn: () => getCustomers({ ...filters, page, limit: 20 }),
        placeholderData: (previousData) => previousData,
    });

    const data = queryData || initialData;

    // ⚡ Logic-driven sort handler (No useEffect required)
    const handleSort = (columnId: string) => {
        const isCurrent = filters.sortBy === columnId;
        const currentSort = isCurrent ? filters.sort : null;

        let nextSort: "asc" | "desc" | undefined;
        if (!currentSort) nextSort = "asc";
        else if (currentSort === "asc") nextSort = "desc";
        else nextSort = undefined;

        if (!nextSort) {
            const { sortBy, sort, ...remainingFilters } = filters;
            setFilters(remainingFilters);
        } else {
            setFilters((prev: any) => ({ ...prev, sortBy: columnId, sort: nextSort }));
        }
        setPage(1);
    };

    return {
        data, loading, page, setPage, sorting, handleSort,
        filtersEnabled, setFiltersEnabled, filters, setFilters,
        ...filterHelpers
    };
}
