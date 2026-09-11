import { useState, useCallback, useEffect } from "react";
import { ACTION_OPTIONS, PAGE_OPTIONS, ROLE_OPTIONS } from "../utils/filterConstants";

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
        setFilters({ siteId: "", search: "", role: "", orderId: "", action: "", view: "", startDate: "", endDate: "" });
    };

    useEffect(() => { setLocalSearch(filters.search || ""); }, [filters.search]);
    useEffect(() => { setLocalOrderId(filters.orderId || ""); }, [filters.orderId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.search || "") !== localSearch) {
                updateFilter("search", localSearch.trim());
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch, filters.search, updateFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.orderId || "") !== localOrderId) {
                updateFilter("orderId", localOrderId.trim());
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localOrderId, filters.orderId, updateFilter]);

    const applyFilters = useCallback(() => {
        setPage(1);
        setFilters((prev: any) => ({
            ...prev,
            search: localSearch.trim(),
            orderId: localOrderId.trim(),
        }));
    }, [setPage, setFilters, localSearch, localOrderId]);

    const activeFilters: { key: string, label: string, value: string }[] = [];
    if (filters.search) activeFilters.push({ key: 'search', label: 'Search', value: filters.search });
    if (filters.role) activeFilters.push({ key: 'role', label: 'Role', value: ROLE_OPTIONS.find(o => o.value === filters.role)?.label || filters.role });
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
        applyFilters,
        activeFilters,
        removeFilter
    };
};
