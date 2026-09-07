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
    documents: "Not Uploaded",
    startDate: "",
    endDate: "",
    repeatedOrders: "all",
    isUrgent: false,
    sortBy: "createdAt",
    sort: "asc", 
};

export function useNotUploadedDocsData() {
    const storageKey = getDashboardStorageKey("not-uploaded-docs");
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
        startLoader("not-uploaded-docs-orders");

        getOrders(page, { ...filters, documents: "Not Uploaded" }).then((res) => {
            if (!ignore) {
                setOrders(res.orders || []);
                setTotal(res.total || 0);
                setLoading(false);
            }
        }).catch(() => {
            if (!ignore) setLoading(false);
        }).finally(() => {
            if (!ignore) stopLoader("not-uploaded-docs-orders");
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
