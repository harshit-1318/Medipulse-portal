import { Search, User, Layers, FileText, Calendar, AlertCircle, Package, ParkingCircle } from "lucide-react";
import { capitalize } from "@/utils";
import type { PageType } from "../../types";
import {
    getStatusOptions,
    getFulfillmentStatusOptions,
    getCustomerOrderOptions,
    getProductTypeOptions,
    getDocumentOptions,
    getProductCategoryOptions
} from "../utils/options";

export function getActiveOrderFilters(filters: any, pageType: PageType) {
    const activeFilters: { key: string, label: string, value: string | boolean, icon: any, isRemovable?: boolean }[] = [];

    if (filters.orderId) activeFilters.push({ key: 'orderId', label: 'Order ID', value: filters.orderId, icon: Search });
    const statusVal = filters.fulfillmentStatus || filters.status;
    if (statusVal && statusVal !== 'all') {
        const isLocked = ["on_hold", "unfulfilled", "fulfilled", "cancelled"].includes(pageType);
        const label = getFulfillmentStatusOptions().find(o => o.value === statusVal || o.label.toLowerCase() === statusVal.toLowerCase())?.label
            || getStatusOptions(pageType).find(o => o.value === statusVal)?.label
            || capitalize(statusVal);
        activeFilters.push({ 
            key: 'status', 
            label: 'Status', 
            value: label, 
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
        const parsed = new Date(filters.startDate);
        const dateVal = !isNaN(parsed.getTime())
            ? new Intl.DateTimeFormat("en-GB", { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parsed)
            : String(filters.startDate);
        activeFilters.push({ key: 'startDate', label: 'Start Date', value: dateVal, icon: Calendar });
    }
    if (filters.endDate) {
        const parsed = new Date(filters.endDate);
        const dateVal = !isNaN(parsed.getTime())
            ? new Intl.DateTimeFormat("en-GB", { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parsed)
            : String(filters.endDate);
        activeFilters.push({ key: 'endDate', label: 'End Date', value: dateVal, icon: Calendar });
    }

    return activeFilters;
}
