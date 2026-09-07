import type { OrderType } from "@/api/services/orders";

export type PageType =
    | "all"
    | "overview"
    | "on_hold"
    | "unfulfilled"
    | "fulfilled"
    | "injectable"
    | "oral"
    | "single"
    | "first"
    | "repeat"
    | "uploaded"
    | "Not uploaded"
    | "urgent"
    | "parked"
    | "cancelled";

export type OrderFilters = {
    orderId?: string;
    status?: string;
    fulfillmentStatus?: string;
    customer?: string;
    products?: string;
    category?: string;
    documents?: string;
    startDate?: string;
    endDate?: string;
    productCategory?: string;
    productName?: string;
    repeatedOrders?: string;
    isUrgent?: boolean;
    isParked?: boolean;
    sortBy?: string;
    sort?: 'asc' | 'desc';
    limit?: number;
    type?: string;
};

/** Shared default filters for all order list hooks.
 *  Override only the fields that differ per page (category, status, isUrgent, etc.). */
export const DEFAULT_ORDER_FILTERS: OrderFilters = {
    orderId: "",
    status: "",
    fulfillmentStatus: "",
    customer: "",
    products: "",
    category: "",
    documents: "",
    startDate: "",
    endDate: "",
    productCategory: "",
    productName: "",
    repeatedOrders: "all",
    isUrgent: false,
    isParked: false,
    sortBy: "id",
    sort: "desc",
};

export interface Props {
    orders: OrderType[];
    title?: string;
    subtitle?: string;
    loading: boolean;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;

    total: number;

    filters: OrderFilters;
    setFilters: React.Dispatch<React.SetStateAction<OrderFilters>>;

    pageType: PageType;
    filtersEnabled?: boolean;
    setFiltersEnabled?: (enabled: boolean) => void;
    hideFilters?: boolean;
}
