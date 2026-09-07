import { useState, useCallback, useEffect } from "react";
import { User, Package, Calendar } from 'lucide-react';
export function useCustomerFilters(
    filters: any,
    setFilters: (f: any) => void,
    setPage: (n: number) => void,
    setFiltersEnabled: (v: boolean) => void
) {
    const [localSearch, setLocalSearch] = useState(filters.search || "");
    const [localTotalPens, setLocalTotalPens] = useState(filters.totalPens || "");
    const [localStartDate, setLocalStartDate] = useState(filters.customer_start_date || "");

    // 🛡️ handleApply: Only trigger server-side fetch on explicit "Apply"
    const handleApply = useCallback(() => {
        setPage(1);
        setFilters((prev: any) => ({
            ...prev,
            search: localSearch,
            totalPens: localTotalPens,
            customer_start_date: localStartDate
        }));
        setFiltersEnabled(false);
    }, [localSearch, localTotalPens, localStartDate, setFilters, setPage, setFiltersEnabled]);

    const updateFilter = useCallback((key: string, value: any) => {
        setPage(1);
        setFilters((prev: any) => ({ ...prev, [key]: value }));

        // Sync local state if updated from chips/outside
        if (key === "search") setLocalSearch(value);
        if (key === "totalPens") setLocalTotalPens(value);
        if (key === "customer_start_date") setLocalStartDate(value);
    }, [setFilters, setPage]);

    const clearFilters = useCallback(() => {
        setPage(1);
        setLocalSearch("");
        setLocalTotalPens("");
        setLocalStartDate("");
        setFilters({
            search: "",
            totalPens: "",
            customer_start_date: "",
            sortBy: "createdAt",
            sort: "desc"
        });
    }, [setFilters, setPage]);

    // Handle Local State Sync when filters change from outside (e.g. chips)
    useEffect(() => {
        setLocalSearch(filters.search || "");
        setLocalTotalPens(filters.totalPens || "");
        setLocalStartDate(filters.customer_start_date || "");
    }, [filters.search, filters.totalPens, filters.customer_start_date]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return {
        localSearch, setLocalSearch,
        localTotalPens, setLocalTotalPens,
        localStartDate, setLocalStartDate,
        handleApply,
        updateFilter,
        clearFilters,
        activeFilterChips: [
            ...(filters.search ? [{ key: 'search', label: 'Cust', value: filters.search, icon: User }] : []),
            ...(filters.totalPens ? [{ key: 'totalPens', label: 'Pens', value: filters.totalPens, icon: Package }] : []),
            ...(filters.customer_start_date ? [{ key: 'customer_start_date', label: 'Start Date', value: formatDate(filters.customer_start_date), icon: Calendar }] : []),
        ],
        removeFilter: (key: string) => {
            if (key === "search") setLocalSearch("");
            if (key === "totalPens") setLocalTotalPens("");
            if (key === "customer_start_date") setLocalStartDate("");
            updateFilter(key, "");
        }
    };
}
