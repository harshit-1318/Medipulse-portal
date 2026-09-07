import apiClient from '../../../apiClient';
import { mapBackendOrderToFrontend } from '../utils';
import type { OrderType } from '../types';

const fetchSpecificStatus = async (status: string, page: number, limit: number): Promise<{ orders: OrderType[], total: number }> => {
    try {
        const response = await apiClient.get<any>({
            url: "/orders/search",
            method: "GET",
            params: { type: "orders", orderStatus: status, page, limit, sortBy: "createdAt", sort: "desc" },
        });
        const data = response;
        const list: any[] = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        const total = Number(data?.total || list.length);
        const orders: OrderType[] = list.map((o) => mapBackendOrderToFrontend(o));
        return { orders, total };
    } catch (error) {
        console.error(`❌ [fetchSpecificStatus: ${status}] Error:`, error);
        return { orders: [], total: 0 };
    }
};

export const getOnHoldOrders = async (page: number = 1, limit: number = 20) => {
    return fetchSpecificStatus("on_hold", page, limit);
};

export const getUnfulfilledOrders = async (page: number = 1, limit: number = 20) => {
    return fetchSpecificStatus("unfulfilled", page, limit);
};

export const getFulfilledOrders = async (page: number = 1, limit: number = 20) => {
    return fetchSpecificStatus("fulfilled", page, limit);
};
