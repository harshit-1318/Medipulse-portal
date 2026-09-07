import type { PageType } from "../types";

export function isFilterLocked(key: string, pageType?: PageType): boolean {
    if (!pageType) return false;
    if (key === 'status' && ["on_hold", "unfulfilled", "fulfilled", "cancelled"].includes(pageType)) return true;
    if (key === 'fulfillmentStatus' && ["on_hold", "unfulfilled", "fulfilled", "cancelled"].includes(pageType)) return true;
    if (key === 'products' && ["injectable", "oral"].includes(pageType)) return true;
    if (key === 'documents' && ["uploaded", "Not uploaded"].includes(pageType)) return true;
    if (key === 'productCategory' && pageType === 'overview') return true;
    if (key === 'isUrgent' && pageType === 'urgent') return true;
    if (key === 'isParked' && pageType === 'parked') return true;
    if (key === 'repeatedOrders' && (pageType === 'first' || pageType === 'repeat' || pageType === 'single')) return true;
    return false;
}
