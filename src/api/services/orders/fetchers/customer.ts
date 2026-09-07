import apiClient from '../../../apiClient';
import { mapBackendOrderToFrontend } from '../utils';
import type { OrderType } from '../types';

export const getSingleOrderCustomers = async (page: number = 1, limit: number = 20): Promise<{ orders: OrderType[], total: number }> => {
    try {
        const response = await apiClient.get<any>({
            url: "/orders/search",
            method: "GET",
            params: { type: "orders", order_type: "first", page, limit },
        });
        const data = response;
        const list: any[] = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        const total = Number(data?.total || list.length);
        const orders: OrderType[] = list.map((o) => mapBackendOrderToFrontend(o, undefined, "first"));
        return { orders, total };
    } catch (error) {
        console.error("❌ [getSingleOrderCustomers] Error:", error);
        return { orders: [], total: 0 };
    }
};

export const getRepeatCustomers = async (page: number = 1, limit: number = 20): Promise<{ orders: OrderType[], total: number }> => {
    try {
        const response = await apiClient.get<any>({
            url: "/orders/search",
            method: "GET",
            params: { type: "orders", order_type: "repeat", page, limit },
        });
        const data = response;
        const list: any[] = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        const total = Number(data?.total || list.length);
        const orders: OrderType[] = list.map((o) => mapBackendOrderToFrontend(o, undefined, "repeat"));
        return { orders, total };
    } catch (error) {
        console.error("❌ [getRepeatCustomers] Error:", error);
        return { orders: [], total: 0 };
    }
};
