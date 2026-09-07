import apiClient from '../../../apiClient';
import { mapBackendOrderToFrontend } from '../utils';
import type { OrderType } from '../types';

export const getUploadedOrders = async (page: number = 1, limit: number = 20): Promise<{ orders: OrderType[], total: number }> => {
    try {
        const response = await apiClient.get<any>({
            url: "/orders/search",
            method: "GET",
            params: { type: "orders", documentStatus: "uploaded", page, limit },
        });
        const data = response;
        const list: any[] = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        const total = Number(data?.total || list.length);
        const orders: OrderType[] = list.map((o) => mapBackendOrderToFrontend(o, "Uploaded"));
        return { orders, total };
    } catch (error) {
        console.error("❌ [getUploadedOrders] Error:", error);
        return { orders: [], total: 0 };
    }
};

export const getNotUploadedOrders = async (page: number = 1, limit: number = 20): Promise<{ orders: OrderType[], total: number }> => {
    try {
        const response = await apiClient.get<any>({
            url: "/orders/search",
            method: "GET",
            params: { type: "orders", documentStatus: "not-uploaded", page, limit },
        });
        const data = response;
        const list: any[] = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        const total = Number(data?.total || list.length);
        const orders: OrderType[] = list.map((o) => mapBackendOrderToFrontend(o, "Not Uploaded"));
        return { orders, total };
    } catch (error) {
        console.error("❌ [getNotUploadedOrders] Error:", error);
        return { orders: [], total: 0 };
    }
};
