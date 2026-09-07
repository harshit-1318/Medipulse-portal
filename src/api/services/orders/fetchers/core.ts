import apiClient from '../../../apiClient';
import { mapBackendOrderToFrontend } from '../utils';
import { buildOrderParams, hasActiveFilters } from '../buildParams';
import type { OrderType } from '../types';
import { enrichOrdersList } from './enrichOrdersList';

export const getOrders = async (
    page: number = 1,
    filters: Record<string, unknown> = {},
    customEndpoint?: string
): Promise<{ orders: OrderType[]; total: number }> => {
    try {
        const active = hasActiveFilters(filters);
        const params = buildOrderParams(page, filters);

        let primaryEndpoint = "/orders/order-list";
        if (active) {
            primaryEndpoint = "/orders/search";
        } else if (customEndpoint) {
            primaryEndpoint = customEndpoint;
        }

        if (!active && !customEndpoint) {
            delete params.type;
        }

        const candidateEndpoints = Array.from(new Set([primaryEndpoint, "/orders"]));
        let response: any = null;
        let lastError: any = null;

        for (const url of candidateEndpoints) {
            try {
                response = await apiClient.get<any>({
                    url,
                    method: "GET",
                    params,
                });
                if (response) break;
            } catch (err: any) {
                lastError = err;
                const status = err?.response?.status;
                if (status === 404 || status === 405) continue;
                throw err;
            }
        }

        if (!response && lastError) {
            throw lastError;
        }

        const list = enrichOrdersList(response);

        const mappedOrders = list.map((o) => {
            return mapBackendOrderToFrontend(o, filters.documents as string, filters.repeatedOrders as string);
        });

        const total = Number(response?.total || (response?.orders ? response.orders.length : list.length));

        return { orders: mappedOrders, total };
    } catch (error) {
        console.error("❌ [getOrders] Error:", error);
        return { orders: [], total: 0 };
    }
};

export const getOrderById = (id: string): Promise<OrderType> =>
    apiClient.get<OrderType>(`/orders/${id}`);

export const lookupOrderByDisplayId = async (displayId: string): Promise<string | null> => {
    const clean = displayId.toString().replace('#', '').trim();
    try {
        const result = await getOrders(1, { orderId: clean, limit: 1 });
        return result.orders[0]?.shopify_order_id ?? null;
    } catch {
        return null;
    }
};

export const createOrder = (data: Partial<OrderType>): Promise<OrderType> =>
    apiClient.post<OrderType>('/orders', data);
