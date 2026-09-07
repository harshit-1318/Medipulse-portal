import { useState, useCallback, useEffect } from "react";
import type { PageType, OrderFilters } from "../../types";

export function useOrderFilters(filters: OrderFilters, setFilters: React.Dispatch<React.SetStateAction<OrderFilters>>, setPage: (n: number) => void, pageType?: PageType) {
    const [localCustomerName, setLocalCustomerName] = useState(filters.customer || "");
    const [localOrderId, setLocalOrderId] = useState(filters.orderId || "");
    const [localProductName, setLocalProductName] = useState(filters.productName || "");

    const updateFilter = useCallback((key: string, value: string | boolean) => {
        setPage(1);
        setFilters((prev: any) => {
            const next = { ...prev, [key]: value };
            // If productCategory changes, reset productName
            if (key === 'productCategory' || key === 'category') {
                next.productName = "";
            }
            return next;
        });
    }, [setPage, setFilters]);

    const clearFilters = () => {
        setPage(1);
        setLocalCustomerName("");
        setLocalOrderId("");
        setLocalProductName("");
        setFilters((prev: OrderFilters) => ({
            orderId: "",
            // status: (pageType && ["on_hold", "unfulfilled", "fulfilled", "cancelled"].includes(pageType)) ? (prev.status || "") : "", 
            fulfillmentStatus: (pageType && ["on_hold", "unfulfilled", "fulfilled", "cancelled"].includes(pageType)) ? (prev.fulfillmentStatus || "") : "",
            customer: "",
            products: (pageType && ["injectable", "oral"].includes(pageType)) ? (prev.products || "") : "",
            category: pageType === 'overview' ? (prev.category || '') : '',
            productCategory: pageType === 'overview' ? (prev.productCategory || '') : '',
            productName: "",
            repeatedOrders: (pageType === 'first' ? 'first' : (pageType === 'repeat' ? 'repeat' : (pageType === 'single' ? 'first' : ""))),
            documents: (pageType && ["uploaded", "Not uploaded"].includes(pageType)) ? (prev.documents || "") : "",
            startDate: "", endDate: "",
            isUrgent: pageType === 'urgent' ? true : false,
            isParked: pageType === 'parked' ? true : false,
            sortBy: prev.sortBy,
            sort: prev.sort,
        }));
    };

    useEffect(() => { setLocalCustomerName(filters.customer || ""); }, [filters.customer]);
    useEffect(() => { setLocalOrderId(filters.orderId || ""); }, [filters.orderId]);
    useEffect(() => { setLocalProductName(filters.productName || ""); }, [filters.productName]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.customer || "") !== localCustomerName) {
                if (localCustomerName.length === 0 || localCustomerName.length >= 3) {
                    updateFilter("customer", localCustomerName);
                }
            }
        }, 900);
        return () => clearTimeout(timer);
    }, [localCustomerName, filters.customer, updateFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.orderId || "") !== localOrderId) {
                if (localOrderId.length === 0 || localOrderId.length >= 3) {
                    updateFilter("orderId", localOrderId);
                }
            }
        }, 900);
        return () => clearTimeout(timer);
    }, [localOrderId, filters.orderId, updateFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.productName || "") !== localProductName) {
                if (localProductName.length === 0 || localProductName.length >= 3) {
                    updateFilter("productName", localProductName);
                }
            }
        }, 900);
        return () => clearTimeout(timer);
    }, [localProductName, filters.productName, updateFilter]);

    return {
        localCustomerName, setLocalCustomerName,
        localOrderId, setLocalOrderId,
        localProductName, setLocalProductName,
        updateFilter, clearFilters
    };
}

