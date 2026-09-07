import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SortingState } from "@tanstack/react-table";
import { useUserInfo, useSiteInfo } from '@/store';
import { useDebounce, useUrlSync } from '@/hooks';
import { getInitialStateFromUrl, getUrlParamInt, getDashboardStorageKey } from '@/utils/url';
import { useUsersData } from './useUsersData';
import { useSortingStateSync } from './useSortingStateSync';
import { DEFAULT_USERS_FILTERS } from './useUsersListConstants';

export function useUsersList() {
    const userInfo = useUserInfo();
    const siteInfo = useSiteInfo();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const siteIdFromStorage = typeof window !== 'undefined' ? localStorage.getItem("X-SITE-ID") : "";
    const currentSiteId = (siteInfo as any)?.id || siteIdFromStorage || "";
    const isSuperAdmin = mounted && userInfo?.effectiveRole === 'super_admin';

    const storageKey = getDashboardStorageKey("users");
    const [page, setPage] = useState(() => getUrlParamInt("page", 1, storageKey));
    
    const initialFilters = getInitialStateFromUrl(DEFAULT_USERS_FILTERS, storageKey);
    const [search, setSearch] = useState(initialFilters.search);
    const [selectedSite, setSelectedSite] = useState(initialFilters.selectedSite);
    const [sortBy, setSortBy] = useState(initialFilters.sortBy);
    const [sort, setSort] = useState(initialFilters.sort);

    const [sorting, setSorting] = useState<SortingState>(() => {
        if (sortBy) return [{ id: sortBy, desc: sort === 'desc' }];
        return [];
    });

    const filters = useMemo(() => ({ search, selectedSite, sortBy, sort }), [search, selectedSite, sortBy, sort]);
    const setFilters = useCallback((nf: typeof DEFAULT_USERS_FILTERS) => {
        if (nf.search !== undefined) setSearch(nf.search);
        if (nf.selectedSite !== undefined) setSelectedSite(nf.selectedSite);
        if (nf.sortBy !== undefined) setSortBy(nf.sortBy);
        if (nf.sort !== undefined) setSort(nf.sort);
    }, []);

    const limit = 20;
    const debouncedSearch = useDebounce(search, 500);

    useUrlSync(filters, setFilters, page, setPage, storageKey, DEFAULT_USERS_FILTERS);

    useEffect(() => {
        if (!isSuperAdmin && currentSiteId && selectedSite === "all") {
            setSelectedSite(String(currentSiteId));
        }
    }, [currentSiteId, isSuperAdmin, selectedSite]);

    useSortingStateSync(sorting, sortBy, sort, setSortBy, setSort, setPage, DEFAULT_USERS_FILTERS.sortBy, DEFAULT_USERS_FILTERS.sort);

    const { users, loading, sites, total, toggleUserActive } = useUsersData({
        page,
        limit,
        debouncedSearch,
        selectedSite,
        sortBy,
        sort,
        isSuperAdmin,
        currentSiteId,
    });

    const removeFilter = useCallback((key: string) => {
        if (key === 'search') setSearch("");
        if (key === 'site') setSelectedSite("all");
    }, []);

    const clearFilters = useCallback(() => {
        setSearch("");
        setSelectedSite("all");
    }, []);

    return {
        users,
        loading,
        sites,
        total,
        page,
        setPage,
        search,
        setSearch,
        selectedSite,
        setSelectedSite,
        sorting,
        setSorting,
        isSuperAdmin,
        removeFilter,
        clearFilters,
        toggleUserActive,
        limit,
        activeFilterCount: (search ? 1 : 0) + (isSuperAdmin && selectedSite !== 'all' ? 1 : 0)
    };
}
