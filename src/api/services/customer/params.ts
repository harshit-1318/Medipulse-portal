import type { CustomerFilters } from "./types";
import { normalizeSortOrder } from "@/utils/url";

/**
 * 🔹 Build query parameters for customer API consistent with backend expectations
 */
export function buildCustomerParams(params: CustomerFilters = {}): any {
    // 1. Initialize Query Params
    const queryParams: any = {
        page: params.page || 1,
        limit: params.limit || 20,
    };

    // 2. Handle Sorting Mapping
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

    // 3. Handle Filters
    if (params.search) queryParams.customer = params.search;
    if (params.totalPens) queryParams.totalPens = params.totalPens;
    if (params.customerId) queryParams.customerId = params.customerId;
    if (params.customerEmail) queryParams.customerEmail = params.customerEmail;
    if (params.customerName) queryParams.customerName = params.customerName;
    if (params.customer_start_date) {
        // UTC midnight — keeps filter in sync with Shopify's UTC-based date display.
        const [y, m, d] = params.customer_start_date.split("-").map(Number);
        queryParams.customer_start_date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0)).toISOString();
    }

    return queryParams;
}
