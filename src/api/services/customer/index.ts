import apiClient from "../../apiClient";
import type { CustomersResponse, CustomerFilters } from "../../../types/customer";
import { normalizeCustomer, buildCustomerParams } from "./utils";

/**
 * 🔹 Get customers list
 * - modularized API interaction
 * - always uses search endpoint as base for consistent sorting/filtering
 */
export const getCustomers = async (params: CustomerFilters = {}): Promise<CustomersResponse> => {
    try {
        const queryParams = buildCustomerParams(params);

        const hasActiveFilters = !!(params.search || params.customerId || params.customerEmail || params.customerName || params.totalPens || params.customer_start_date);
        const isNoneState = !params.sortBy;

        const url = (!hasActiveFilters && isNoneState)
            ? "/orders/customers/list"
            : "/orders/search";

        const response: any = await apiClient.get({
            url,
            params: url === "/orders/search" ? { ...queryParams, type: "customers" } : queryParams,
        });

        const rawList = response?.customers ?? (Array.isArray(response) ? response : []);
        const total = Number(response?.total ?? (Array.isArray(response) ? response.length : 0));

        const customers = rawList.map(normalizeCustomer);

        return { customers, total, page: params.page || 1, limit: params.limit || 20 };
    } catch (err) {
        console.error("❌ [getCustomers] Error:", err);
        return { customers: [], total: 0, page: params.page || 1, limit: params.limit || 20 };
    }
};

/**
 * 🔹 Filter customers
 */
export const filterCustomers = async (filters: CustomerFilters = {}): Promise<CustomersResponse> => {
    try {
        const queryParams = buildCustomerParams(filters);

        const response: any = await apiClient.get({
            url: "/orders/search",
            params: { ...queryParams, type: "customers" },
        });

        const rawList = response?.customers ?? (Array.isArray(response) ? response : []);
        const total = Number(response?.total ?? (Array.isArray(response) ? response.length : 0));

        const customers = rawList.map(normalizeCustomer);

        return { customers, total, page: filters.page || 1, limit: filters.limit || 20 };
    } catch (err) {
        console.error("❌ [filterCustomers] Error:", err);
        return { customers: [], total: 0, page: filters.page || 1, limit: filters.limit || 20 };
    }
};
