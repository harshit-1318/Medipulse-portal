import apiClient from "@/api/apiClient";
import type { Prescription, PrescriptionResponse } from "@/types/prescription";
import { normalizeSortOrder } from "@/utils/url/urlBase";

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
            sort: normalizeSortOrder(filters.sort)
        };

        if (isSearchMode) {
            params.type = "prescriptions";

            const sortMapping: Record<string, string> = {
                orderDate: "orderDate",
                customerId: "customerId",
                createdAt: "createdAt",
                pharmacistName: "pharmacistName",
                generatedAt: "generatedAt",
                shopifyOrderId: "shopifyOrderId",
            };

            if (filters.sortBy) {
                params.sortBy = sortMapping[filters.sortBy] || filters.sortBy;
            }

            if (filters.orderId && String(filters.orderId).trim()) {
                params.orderId = String(filters.orderId).trim();
            }

            if (filters.customerId && String(filters.customerId).trim()) {
                params.customerId = String(filters.customerId).trim();
            }

            if (filters.prescriber && String(filters.prescriber).trim()) {
                params.prescriber = String(filters.prescriber).trim();
            }

            if (filters.startDate) {
                params.orderDate = filters.startDate;
            }

            if (filters.reviewStartDate) {
                params.reviewDate = filters.reviewStartDate;
            }
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
