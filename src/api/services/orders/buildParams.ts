import { normalizeSortOrder, normalizeSortBy } from "@/utils/url";
import { applyDateAndCategoryFilters } from "./orderParamsNormalizer";

export const buildOrderParams = (page: number, filters: any = {}): any => {
    const isUrgentMode = filters.isUrgent === true || filters.isUrgent === "true";
    const isParkedMode = filters.isParked === true || filters.isParked === "true";
    
    const sortMapping: Record<string, string> = {
        date: "createdAt",
        id: "shopify_order_id",
        customer: "customer",
        product: "product",
        products: "product",
        status: "status",
        documentsUploaded: "documentsUploaded",
        repeatedOrders: "repeatCount",
        name: "createdAt",
        createdAt: "createdAt",
    };

    const rawSortBy = filters.sortBy || "createdAt";
    const finalSortBy = sortMapping[rawSortBy] || normalizeSortBy(rawSortBy) || "createdAt";

    const params: any = {
        type: filters.type || "orders",
        page,
        limit: filters.limit || 20,
        sortBy: finalSortBy,
        sort: normalizeSortOrder(filters.sort || "asc"),
    };

    if (isUrgentMode) params.isUrgent = true;
    if (isParkedMode) params.isParked = true;

    if (filters.orderId) {
        params.orderId = String(filters.orderId).trim();
    }

    if (filters.customer || filters.search) {
        const searchValue = String(filters.customer || filters.search).trim();
        
        if (filters.type === "customers") {
            params.customer = searchValue;
        } else {
            if (searchValue.includes("@")) {
                params.customerEmail = searchValue;
            } else if (/^\d+$/.test(searchValue)) {
                params.customerId = searchValue;
            } else {
                params.customerName = searchValue.replace(/\.+$/, "");
            }
        }
    }

    applyDateAndCategoryFilters(params, filters);

    return params;
};

export const hasActiveFilters = (filters: any = {}): boolean => {
    const isUrgentMode = filters.isUrgent === true || filters.isUrgent === "true";
    const isParkedMode = filters.isParked === true || filters.isParked === "true";

    return Boolean(
        isUrgentMode ||
        isParkedMode ||
        filters.status ||
        filters.category ||
        filters.documents ||
        filters.customer ||
        filters.startDate ||
        filters.endDate ||
        filters.products ||
        filters.productCategory ||
        filters.productName ||
        filters.orderId ||
        filters.fulfillmentStatus ||
        filters.search ||
        (filters.repeatedOrders && filters.repeatedOrders !== "all" && filters.repeatedOrders !== "")
    );
};
