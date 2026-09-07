import { useState, useCallback, useEffect } from "react";
import { ACTION_OPTIONS, PAGE_OPTIONS } from "../utils/filterConstants";

type SiteOption = { label: string; value: string };

export const useActivityFilters = (
    filters: any,
    setFilters: (f: any) => void,
    setPage: (n: number) => void,
    siteOptions: SiteOption[] = [],
) => {
    const [localSearch, setLocalSearch] = useState(filters.search || "");
    const [localOrderId, setLocalOrderId] = useState(filters.orderId || "");

    const updateFilter = useCallback((key: string, value: string) => {
        setPage(1);
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    }, [setPage, setFilters]);

    const clearFilters = () => {
        setPage(1);
        setLocalSearch("");
        setLocalOrderId("");
        setFilters({ siteId: "", search: "", orderId: "", action: "", view: "", startDate: "", endDate: "" });
    };

    useEffect(() => { setLocalSearch(filters.search || ""); }, [filters.search]);
    useEffect(() => { setLocalOrderId(filters.orderId || ""); }, [filters.orderId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.search || "") !== localSearch) {
                if (localSearch.length === 0 || localSearch.length >= 3) updateFilter("search", localSearch);
            }
        }, 900);
        return () => clearTimeout(timer);
    }, [localSearch, filters.search, updateFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.orderId || "") !== localOrderId) {
                if (localOrderId.length === 0 || localOrderId.length >= 3) updateFilter("orderId", localOrderId);
            }
        }, 900);
        return () => clearTimeout(timer);
    }, [localOrderId, filters.orderId, updateFilter]);

    const activeFilters: { key: string, label: string, value: string }[] = [];
    if (filters.search) activeFilters.push({ key: 'search', label: 'Search', value: filters.search });
    if (filters.orderId) activeFilters.push({ key: 'orderId', label: 'Subject', value: filters.orderId });
    if (filters.action) activeFilters.push({ key: 'action', label: 'Action', value: ACTION_OPTIONS.find(o => o.value === filters.action)?.label || filters.action });
    if (filters.view) activeFilters.push({ key: 'view', label: 'Page', value: PAGE_OPTIONS.find(o => o.value === filters.view)?.label || filters.view });
    if (filters.siteId) activeFilters.push({ key: 'siteId', label: 'Site', value: siteOptions.find((o) => o.value === filters.siteId)?.label || filters.siteId });
    if (filters.startDate) activeFilters.push({ key: 'startDate', label: 'Start Date', value: filters.startDate });
    if (filters.endDate) activeFilters.push({ key: 'endDate', label: 'End Date', value: filters.endDate });

    const removeFilter = (key: string) => {
        if (key === 'search') setLocalSearch("");
        if (key === 'orderId') setLocalOrderId("");
        updateFilter(key, "");
    };

    return {
        localSearch,
        setLocalSearch,
        localOrderId,
        setLocalOrderId,
        updateFilter,
        clearFilters,
        activeFilters,
        removeFilter
    };
};
