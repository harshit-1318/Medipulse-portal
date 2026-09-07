import { useState, useEffect } from "react";
import type { OrderFilters } from "../types";
import { DEFAULT_ORDER_FILTERS } from "../types";

export const DEFAULT_FILTERS: OrderFilters = {
    ...DEFAULT_ORDER_FILTERS,
    status: "all",
    products: "all",
    category: "all",
    productCategory: "all",
    documents: "all",
    type: "orders",
};

export const useSearchOrdersData = (initialData: any) => {
    const initialFilters = initialData?.filters || DEFAULT_FILTERS;
    const [page, setPage] = useState(initialData?.page || 1);
    const [filters, setFilters] = useState<OrderFilters>(initialFilters);

    // 🛡️ SYNC PAGE CHANGE TO URL (Non-reloading)
    useEffect(() => {
        if (page !== initialData?.page) {
            const params = new URLSearchParams(window.location.search);
            params.set('page', String(page));
            const newPath = `${window.location.pathname}?${params.toString()}`;
            window.history.pushState({}, '', newPath);
        }
    }, [page, initialData?.page]);

    // 🛡️ SYNC FILTER CHANGE TO URL (Non-reloading)
    useEffect(() => {
        const hasFilterChanged = JSON.stringify(filters) !== JSON.stringify(initialFilters);
        if (hasFilterChanged) {
            const params = new URLSearchParams(window.location.search);
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "" && value !== "all" && value !== false) {
                    params.set(key, String(value));
                } else {
                    params.delete(key);
                }
            });
            // Reset page on filter change
            params.delete('page');
            const newPath = `${window.location.pathname}?${params.toString()}`;
            window.history.pushState({}, '', newPath);
        }
    }, [filters, initialFilters]);

    const [filtersEnabled, setFiltersEnabled] = useState(true);

    return {
        orders: initialData?.orders || [],
        total: initialData?.total || 0,
        loading: false,
        page,
        setPage,
        filters,
        setFilters,
        filtersEnabled,
        setFiltersEnabled
    };
};
