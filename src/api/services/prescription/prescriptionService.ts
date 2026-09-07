import apiClient from "@/api/apiClient";
import type { Prescription, PrescriptionResponse } from "@/types/prescription";

export const getPrescriptions = async (page: number = 1, limit: number = 20, filters: any = {}): Promise<PrescriptionResponse> => {
    try {

        const hasFilters = !!(
            filters.orderId || filters.prescriber || filters.customerId ||
            filters.startDate || filters.reviewStartDate
        );

        // search mode is triggered if any filter is set or any sortBy is selected
        const isSearchMode = hasFilters || !!filters.sortBy;
        const url = isSearchMode ? "/orders/search" : "/orders/prescription-list";

        const params: any = {
            page,
            limit,
            sort: filters.sort || "asc"
        };

        if (isSearchMode) {
            params.type = "prescriptions";

            // Handle Sorting for Search API - Explicitly mapping as per requirements
            const sortMapping: Record<string, string> = {
                orderDate: "createdAt",
                customerId: "customerId",
                createdAt: "createdAt",
                pharmacistName: "pharmacistName",
                generatedAt: "generatedAt",
            };

            if (filters.sortBy) {
                params.sortBy = sortMapping[filters.sortBy] || filters.sortBy;
            }

            // Handle Filters
            if (filters.orderId) params.orderId = filters.orderId;

            if (filters.prescriber) {
                const val = filters.prescriber.trim();
                if (/^\d+$/.test(val)) {
                    params.regNo = val;
                } else if (val.includes('@')) {
                    params.pharmacistEmail = val;
                } else {
                    params.pharmacistName = val;
                }
            }

            if (filters.customerId) params.customerId = filters.customerId;

            // Map dates correctly based on which filter is active (Single Date Only)
            const sDate = filters.reviewStartDate || filters.startDate;
            if (sDate) params.start_date = sDate;
        }

        const response: any = await apiClient.get({
            url,
            method: "GET",
            params,
        });

        const data = response ?? {};
        const list: Prescription[] = Array.isArray(data.prescriptions)
            ? data.prescriptions
            : Array.isArray(data) ? data : [];

        const total = Number(data.total || list.length);

        return { total, page, limit, prescriptions: list };
    } catch (error) {
        console.error("❌ [getPrescriptions] Error:", error);
        return { total: 0, page: 1, limit: 20, prescriptions: [] };
    }
};
