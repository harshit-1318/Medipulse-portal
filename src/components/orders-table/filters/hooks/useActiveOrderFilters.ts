import { Search, User, Layers, FileText, Calendar, AlertCircle, Package, ParkingCircle } from "lucide-react";
import { capitalize } from "@/utils";
import type { PageType } from "../../types";
import {
    getStatusOptions,
    getCustomerOrderOptions,
    getProductTypeOptions,
    getDocumentOptions,
    getProductCategoryOptions
} from "../utils/options";

export function getActiveOrderFilters(filters: any, pageType: PageType) {
    const activeFilters: { key: string, label: string, value: string | boolean, icon: any, isRemovable?: boolean }[] = [];

    if (filters.orderId) activeFilters.push({ key: 'orderId', label: 'Order ID', value: filters.orderId, icon: Search });
    if (filters.status && filters.status !== 'all') {
        const isLocked = ["on_hold", "unfulfilled", "fulfilled", "cancelled"].includes(pageType);
        activeFilters.push({ 
            key: 'status', 
            label: 'Status', 
            value: getStatusOptions(pageType).find(o => o.value === filters.status)?.label || capitalize(filters.status), 
            icon: Layers,
            isRemovable: !isLocked
        });
    }
    if (filters.customer) activeFilters.push({ key: 'customer', label: 'Customer', value: filters.customer, icon: User });
    if (filters.repeatedOrders && filters.repeatedOrders !== 'all') {
        const isLocked = pageType === 'first' || pageType === 'repeat' || pageType === 'single';
        activeFilters.push({ 
            key: 'repeatedOrders', 
            label: 'Orders', 
            value: getCustomerOrderOptions(pageType).find(o => o.value === filters.repeatedOrders)?.label || filters.repeatedOrders, 
            icon: FileText,
            isRemovable: !isLocked
        });
    }
    if (filters.products && filters.products !== 'all') {
        const isLocked = ["injectable", "oral"].includes(pageType);
        activeFilters.push({ 
            key: 'products', 
            label: 'Product Type', 
            value: getProductTypeOptions(pageType, filters.category).find(o => o.value === filters.products)?.label || capitalize(filters.products), 
            icon: Layers,
            isRemovable: !isLocked
        });
    }
    
    const categoryValue = filters.productCategory || filters.category;
    if (categoryValue && categoryValue !== 'all') {
        const categoryLabel = getProductCategoryOptions().find(o => o.value === categoryValue)?.label || capitalize(categoryValue);
        const isLocked = pageType === 'overview';
        activeFilters.push({ key: 'productCategory', label: 'Product Category', value: categoryLabel, icon: Layers, isRemovable: !isLocked });
    }

    if (filters.productName) {
        activeFilters.push({ key: 'productName', label: 'Product', value: filters.productName, icon: Package });
    }
    
    if (filters.isUrgent && pageType !== 'urgent') {
        activeFilters.push({ key: 'isUrgent', label: 'Urgent', value: 'Yes', icon: AlertCircle });
    }
    if (filters.isParked && pageType !== 'parked') {
        activeFilters.push({ key: 'isParked', label: 'Parked', value: 'Yes', icon: ParkingCircle });
    }

    if (filters.documents && filters.documents !== 'all') {
        const isLocked = ["uploaded", "Not uploaded"].includes(pageType);
        activeFilters.push({ 
            key: 'documents', 
            label: 'Documents', 
            value: getDocumentOptions(pageType).find(o => o.value === filters.documents)?.label || capitalize(filters.documents), 
            icon: FileText,
            isRemovable: !isLocked
        });
    }
    if (filters.startDate) {
        const dateVal = new Intl.DateTimeFormat("en-GB", { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(filters.startDate));
        activeFilters.push({ key: 'startDate', label: 'Start Date', value: dateVal, icon: Calendar });
    }
    if (filters.endDate) {
        const dateVal = new Intl.DateTimeFormat("en-GB", { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(filters.endDate));
        activeFilters.push({ key: 'endDate', label: 'End Date', value: dateVal, icon: Calendar });
    }

    return activeFilters;
}
