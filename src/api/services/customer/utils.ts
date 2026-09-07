import type { Customer, CustomerFilters } from "../../../types/customer";
import { normalizeSortOrder } from "@/utils/url/urlBase";

/**
 * 🔹 Normalize raw customer data from API
 */
export function normalizeCustomer(c: any): Customer {
    const rawId = c?.customerId;

    // BIGINT / Long safe handling
    const customerId = typeof rawId === "object" && rawId !== null ? String(rawId.low ?? rawId) : String(rawId ?? "");

    return {
        customerId,
        name: c?.name?.trim() || "N/A",
        email: c?.email?.trim() || "N/A",
        totalOrders: Number(c?.totalOrders ?? 0),
        totalPens: Number(c?.totalPens ?? 0),
        createdAt: c?.createdAt || c?.created_at || "",
    };
}

/**
 * 🔹 Build query parameters for customer API consistent with backend expectations
 */
export function buildCustomerParams(params: CustomerFilters = {}): any {
    // 1. Initialize Query Params
    const queryParams: any = {
        page: params.page || 1,
        limit: params.limit || 20
    };

    // 3. Handle Sorting Mapping
    const sortMapping: Record<string, string> = {
        name: "name",
        email: "email",
        customerId: "customerId",
        totalPens: "totalPens",
        createdAt: "createdAt",
    };

    if (params.sortBy) {
        queryParams.sortBy = sortMapping[params.sortBy] || params.sortBy;
    }

    if (params.sort) {
        queryParams.sort = normalizeSortOrder(params.sort);
    }

    // 4. Handle Filters
    if (params.search) queryParams.customer = params.search;
    if (params.totalPens) queryParams.totalPens = params.totalPens;
    if (params.customerId) queryParams.customerId = params.customerId;
    if (params.customerEmail) queryParams.customerEmail = params.customerEmail;
    if (params.customerName) queryParams.customerName = params.customerName;
    if (params.customer_start_date) {
        // UTC midnight — keeps filter in sync with Shopify's UTC-based date display.
        const [y, m, d] = params.customer_start_date.split('-').map(Number);
        queryParams.customer_start_date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0)).toISOString();
    }

    return queryParams;
}
