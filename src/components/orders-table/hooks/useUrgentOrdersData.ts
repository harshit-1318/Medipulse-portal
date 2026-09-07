import { useState, useEffect } from "react";
import { useGlobalLoader } from '@/store';
import { getOrders, type OrderType } from "@/api/services/orders";
import type { OrderFilters } from "../types";
import { DEFAULT_ORDER_FILTERS } from "../types";
import { useUrlSync } from '@/hooks';
import { getInitialOrderFilters, getUrlParamInt, getDashboardStorageKey } from '@/utils/url';

const DEFAULT_FILTERS: OrderFilters = {
    ...DEFAULT_ORDER_FILTERS,
    isUrgent: true, // DEFAULT TO TRUE FOR URGENT ORDERS PAGE
};

export function useUrgentOrdersData() {
    const storageKey = getDashboardStorageKey("urgent");
    const [page, setPage] = useState(() => getUrlParamInt("page", 1, storageKey));
    const [filters, setFilters] = useState<OrderFilters>(() => getInitialOrderFilters(DEFAULT_FILTERS, storageKey));
    
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const [filtersEnabled, setFiltersEnabled] = useState(false);

    const { start: startLoader, stop: stopLoader } = useGlobalLoader();

    /* -------------------- URL Sync -------------------- */
    useUrlSync(filters, setFilters, page, setPage, storageKey, DEFAULT_FILTERS);

    /* -------------------- Load Orders -------------------- */
    useEffect(() => {
        let ignore = false;
        setLoading(true);
        startLoader("urgent-orders");

        getOrders(page, filters).then((res) => {
            if (!ignore) {
                setOrders(res.orders || []);
                setTotal(res.total || 0);
                setLoading(false);
            }
        }).catch(() => {
            if (!ignore) setLoading(false);
        }).finally(() => {
            if (!ignore) stopLoader("urgent-orders");
        });

        return () => {
            ignore = true;
        };
    }, [page, filters]);

    return {
        orders,
        page,
        setPage,
        total,
        loading,
        filters,
        setFilters,
        filtersEnabled,
        setFiltersEnabled
    };
}
