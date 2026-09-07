import { Search, User, Layers, FileText, Calendar, AlertCircle, Package, ParkingCircle } from "lucide-react";
import type { OrderFilters, PageType } from "../types";
import { getProductCategoryOptions, ALL_PRODUCT_TYPES } from "../filters";
import { capitalize } from "../../../utils";
import { isFilterLocked } from "../utils/isFilterLocked";

export function useActiveFilters(filters: OrderFilters, setFilters: (f: any) => void, setPage: (n: number) => void, pageType?: PageType) {
    const getActiveFilters = () => {
        if (!filters) return [];
        const active: { label: string, key: string, icon: any, isRemovable?: boolean }[] = [];

        if (filters.fulfillmentStatus && filters.fulfillmentStatus !== 'all') active.push({ label: `Fulfillment: ${capitalize(filters.fulfillmentStatus)}`, key: 'fulfillmentStatus', icon: Layers, isRemovable: !isFilterLocked('fulfillmentStatus', pageType) });
        if (filters.orderId) active.push({ label: `ID: ${filters.orderId}`, key: 'orderId', icon: Search, isRemovable: true });
        if (filters.customer) active.push({ label: `Cust: ${filters.customer}`, key: 'customer', icon: User, isRemovable: true });
        if (filters.products && filters.products !== 'all') {
            const productLabel = ALL_PRODUCT_TYPES.find(o => o.value === filters.products)?.label || capitalize(filters.products);
            active.push({ label: `Prod: ${productLabel}`, key: 'products', icon: Layers, isRemovable: !isFilterLocked('products', pageType) });
        }
        if (filters.productName) active.push({ label: `Product: ${filters.productName}`, key: 'productName', icon: Package, isRemovable: true });
        if (filters.repeatedOrders && filters.repeatedOrders !== 'all') {
            active.push({
                label: `Orders: ${filters.repeatedOrders === 'first' ? 'First' : 'Repeat'}`,
                key: 'repeatedOrders',
                icon: FileText,
                isRemovable: !isFilterLocked('repeatedOrders', pageType)
            });
        }
        if (filters.documents && filters.documents !== 'all') active.push({ label: `Docs: ${capitalize(filters.documents)}`, key: 'documents', icon: FileText, isRemovable: !isFilterLocked('documents', pageType) });

        if (filters.productCategory && filters.productCategory !== 'all') {
            const label = getProductCategoryOptions().find(o => o.value === filters.productCategory)?.label || capitalize(filters.productCategory);
            active.push({
                label: `Category: ${label}`,
                key: 'productCategory',
                icon: Layers,
                isRemovable: !isFilterLocked('productCategory', pageType)
            });
        }

        if (filters.isUrgent) {
            active.push({ label: `Urgent`, key: 'isUrgent', icon: AlertCircle, isRemovable: !isFilterLocked('isUrgent', pageType) });
        }
        if (filters.isParked) {
            active.push({ label: `Parked`, key: 'isParked', icon: ParkingCircle, isRemovable: !isFilterLocked('isParked', pageType) });
        }
        if (filters.startDate || filters.endDate) {
            const formatOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' };
            const start = filters.startDate ? new Intl.DateTimeFormat("en-GB", formatOptions).format(new Date(filters.startDate)) : '...';
            const end = filters.endDate ? new Intl.DateTimeFormat("en-GB", formatOptions).format(new Date(filters.endDate)) : '...';
            active.push({ label: `${start} - ${end}`, key: 'dateRange', icon: Calendar, isRemovable: true });
        }
        return active;
    };

    const activeFilterBadges = getActiveFilters();

    const removeFilterBadge = (key: string) => {
        if (!setFilters || isFilterLocked(key, pageType)) return;

        setFilters((prev: any) => {
            const next = { ...prev };
            if (key === 'dateRange') {
                next.startDate = '';
                next.endDate = '';
            } else if (key === 'isUrgent') {
                next.isUrgent = false;
            } else if (key === 'isParked') {
                next.isParked = false;
            } else if (key === 'repeatedOrders') {
                next.repeatedOrders = 'all';
            } else {
                next[key] = '';
            }
            return next;
        });
        if (setPage) setPage(1);
    };

    return { activeFilterBadges, removeFilterBadge };
}

