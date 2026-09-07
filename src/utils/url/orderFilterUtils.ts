import { normalizeSortOrder } from "./urlBase";
import type { OrderFilters } from "../../components/orders-table/types";

export function parseFiltersFromParams<T extends Record<string, any>>(params: URLSearchParams, defaults: T): T {
    const filters: any = { ...defaults };

    Object.keys(defaults).forEach((key) => {
        let value = params.get(key);
        
        // Handle common mappings (Aliases)
        if (value === null && key === 'customer') {
            value = params.get("customerId") || params.get("customerName") || params.get("customer_id") || params.get("customer_name");
        }
        if (value === null && key === 'orderId') value = params.get("id");
        if (value === null && key === 'products') value = params.get("productName") || params.get("product_type");
        if (value === null && key === 'status') value = params.get("orderStatus");
        if (value === null && key === 'category') value = params.get("product_category");
        if (value === null && key === 'startDate') value = params.get("start_date");
        if (value === null && key === 'endDate') value = params.get("end_date");
        if (value === null && key === 'repeatedOrders') value = params.get("order_type");
        if (value === null && key === 'sort') value = params.get("sortDir");
        if (value === null && key === 'documents') value = params.get("documentStatus");

        if (value !== null) {
            if (key === 'documents') {
                if (value.toLowerCase() === 'uploaded') value = 'Uploaded';
                if (value.toLowerCase() === 'not_uploaded' || value.toLowerCase() === 'not uploaded') value = 'Not Uploaded';
            }

            if (typeof defaults[key] === 'boolean') {
                filters[key] = value === 'true';
            } else if (typeof defaults[key] === 'number' || key === 'limit') {
                const num = parseInt(value, 10);
                filters[key] = isNaN(num) ? defaults[key] : num;
            } else if (key === 'sort') {
                filters[key] = normalizeSortOrder(value);
            } else {
                filters[key] = value;
            }
        }
    });

    return filters as T;
}

// Bump this when default filter values change (e.g. new sortBy/sort default).
// Any localStorage entry written by an older version is silently discarded,
// preventing stale values from overriding new defaults.
export const STORAGE_VERSION = 2;

export function getInitialOrderFilters(defaults: OrderFilters, storageKey?: string): OrderFilters {
    if (typeof window === 'undefined') return defaults;
    const params = new URLSearchParams(window.location.search);
    
    let hasUrlParams = false;
    const keysToCheck = ['customerId', 'customerName', 'id', 'productName', 'product_type', 'orderStatus', 'product_category', 'start_date', 'end_date', 'order_type', 'sortDir', 'limit', 'documentStatus'];
    
    Object.keys(defaults).forEach((key) => {
        if (params.has(key)) hasUrlParams = true;
    });
    keysToCheck.forEach(k => { if (params.has(k)) hasUrlParams = true; });

    if (!hasUrlParams && storageKey) {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsedStored = JSON.parse(stored);
                // Discard entries written by older code versions to prevent
                // stale sort/filter values overriding new defaults.
                if (parsedStored._v !== STORAGE_VERSION) {
                    localStorage.removeItem(storageKey);
                    return defaults;
                }
                const { _v, ...restStored } = parsedStored;
                return { ...defaults, ...restStored, category: defaults.category };
            } catch (e) {}
        }
        return defaults;
    }

    return parseFiltersFromParams(params, defaults);
}
