import { useState, useEffect } from "react";
import { useGlobalLoader } from '@/store';
import { getOrders, type OrderType } from "@/api/services/orders";
import type { OrderFilters } from "../../types";
import { useUrlSync } from '@/hooks';
import { getInitialOrderFilters, getUrlParamInt, getDashboardStorageKey } from '@/utils/url';

const DEFAULT_FILTERS: OrderFilters = {
    orderId: "",
    status: "",
    customer: "",
    products: "",
    category: "",
    documents: "",
    startDate: "",
    endDate: "",
    repeatedOrders: "repeat",
    isUrgent: false,
    sortBy: "shopify_order_id",
    sort: "desc",
};

export function useRepeatOrdersData() {
    const storageKey = getDashboardStorageKey("repeat");
    const [page, setPage] = useState(() => getUrlParamInt("page", 1, storageKey));
    const [filters, setFilters] = useState<OrderFilters>(() => getInitialOrderFilters(DEFAULT_FILTERS, storageKey));

    const [orders, setOrders] = useState<OrderType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filtersEnabled, setFiltersEnabled] = useState(false);
    const { start: startLoader, stop: stopLoader } = useGlobalLoader();

    /* -------------------- URL Sync -------------------- */
    useUrlSync(filters, setFilters, page, setPage, storageKey, DEFAULT_FILTERS);

    /* -------------------- Sync customerId from URL -------------------- */
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const customerId = searchParams.get("customerId") || "";

            if (customerId && filters.customer !== customerId) {
                setFilters((prev) => ({
                    ...prev,
                    customer: customerId,
                }));
                setPage(1);
                setFiltersEnabled(true);
            }
        }
    }, []);

    /* -------------------- Load Orders -------------------- */
    useEffect(() => {
        let ignore = false;
        setLoading(true);
        startLoader("repeat-orders");

        const apiFilters = {
            ...filters,
            repeatedOrders: "repeat",
        };

        getOrders(page, apiFilters).then((res) => {
            if (!ignore) {
                setOrders(res.orders || []);
                setTotal(res.total || 0);
                setLoading(false);
            }
        }).catch(() => {
            if (!ignore) setLoading(false);
        }).finally(() => {
            if (!ignore) stopLoader("repeat-orders");
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
