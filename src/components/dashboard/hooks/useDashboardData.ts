import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/services/dashboard/dashboardService";
import { getOrders } from "@/api/services/orders";
import type { OrderFilters } from "../../orders-table/types";
import { DEFAULT_ORDER_FILTERS } from "../../orders-table/types";
import { useUrlSync } from '@/hooks';
import { getInitialOrderFilters, getUrlParamInt, getDashboardStorageKey } from '@/utils/url';
import { useUserInfo } from '@/store';

const DEFAULT_FILTERS: OrderFilters = {
    ...DEFAULT_ORDER_FILTERS,
    category: "weight-loss",
    productCategory: "weight-loss",
};

export function useDashboardData() {
    const user = useUserInfo();
    const role = (user?.effectiveRole || user?.role || '').toLowerCase();
    const canViewClinicalOrders = !['customer', 'user', 'driver'].includes(role);

    const storageKey = getDashboardStorageKey("main-dashboard");
    const [page, setPage] = useState(() => getUrlParamInt("page", 1, storageKey));
    const initialFilters = getInitialOrderFilters(DEFAULT_FILTERS, storageKey);
    const [filters, setFilters] = useState<OrderFilters>(initialFilters);

    /* -------------------- URL Sync -------------------- */
    useUrlSync(filters, setFilters, page, setPage, storageKey, DEFAULT_FILTERS);

    /* -------------------- Load Dashboard Stats -------------------- */
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
        enabled: canViewClinicalOrders,
        refetchOnMount: "always",
    });

    /* -------------------- Load Orders -------------------- */
    const { data: orderResponse, isLoading: ordersLoading } = useQuery({
        queryKey: ["dashboard-orders", page, filters],
        queryFn: () => getOrders(page, filters, "/orders/order-list"),
        enabled: canViewClinicalOrders,
        refetchOnMount: "always",
    });

    return {
        role,
        canViewClinicalOrders,
        stats: stats || null,
        orders: orderResponse?.orders || [],
        page,
        setPage,
        total: orderResponse?.total || 0,
        loading: statsLoading || ordersLoading,
        filters,
        setFilters
    };
}
