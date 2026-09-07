import { useState, useCallback, useEffect } from "react";
import { usePrescriptionDebouncedFilters } from "./usePrescriptionDebouncedFilters";

export function usePrescriptionFilters(filters: any, setFilters: (f: any) => void, setPage: (n: number) => void) {
    const [localOrderId, setLocalOrderId] = useState(filters.orderId || "");
    const [localPrescriber, setLocalPrescriber] = useState(filters.prescriber || "");
    const [localCustomerId, setLocalCustomerId] = useState(filters.customerId || "");

    const formatDateToDisplay = (dateStr: string) => {
        if (!dateStr || !dateStr.includes('-')) return dateStr;
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;

            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    const updateFilter = useCallback((key: string, value: string | boolean) => {
        setPage(1);
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    }, [setPage, setFilters]);

    const clearFilters = () => {
        setPage(1);
        setLocalOrderId("");
        setLocalPrescriber("");
        setLocalCustomerId("");
        setFilters((prev: any) => ({
            ...prev,
            orderId: "",
            prescriber: "",
            customerId: "",
            startDate: "",
            reviewStartDate: "",
        }));
    };

    useEffect(() => { setLocalOrderId(filters.orderId || ""); }, [filters.orderId]);
    useEffect(() => { setLocalPrescriber(filters.prescriber || ""); }, [filters.prescriber]);
    useEffect(() => { setLocalCustomerId(filters.customerId || ""); }, [filters.customerId]);

    usePrescriptionDebouncedFilters(localOrderId, filters.orderId, 2, "orderId", updateFilter);
    usePrescriptionDebouncedFilters(localPrescriber, filters.prescriber, 3, "prescriber", updateFilter);
    usePrescriptionDebouncedFilters(localCustomerId, filters.customerId, 3, "customerId", updateFilter);

    return {
        localOrderId,
        setLocalOrderId,
        localPrescriber,
        setLocalPrescriber,
        localCustomerId,
        setLocalCustomerId,
        updateFilter,
        clearFilters,
        activeFilterChips: [
            ...(filters.orderId ? [{ key: 'orderId', label: 'Order ID', value: filters.orderId, icon: 'ExternalLink' }] : []),
            ...(filters.prescriber ? [{ key: 'prescriber', label: 'Prescriber', value: filters.prescriber, icon: 'UserCircle' }] : []),
            ...(filters.customerId ? [{ key: 'customerId', label: 'Customer ID', value: filters.customerId, icon: 'User' }] : []),
            ...(filters.startDate ? [{ key: 'startDate', label: 'Order Date', value: formatDateToDisplay(filters.startDate), icon: 'Calendar' }] : []),
            ...(filters.reviewStartDate ? [{ key: 'reviewStartDate', label: 'Review Date', value: formatDateToDisplay(filters.reviewStartDate), icon: 'CalendarCheck' }] : []),
        ],
        removeFilter: (key: string) => {
            if (key === 'orderId') setLocalOrderId("");
            if (key === 'prescriber') setLocalPrescriber("");
            if (key === 'customerId') setLocalCustomerId("");
            updateFilter(key, "");
        }
    };
}

