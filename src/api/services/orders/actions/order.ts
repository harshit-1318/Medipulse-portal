import type { AxiosError } from "axios";
import apiClient from "../../../apiClient";
import type { CancelOrderPayload } from "../types";

export const updateScrReview = async (payload: { order_id: string;[key: string]: unknown }): Promise<unknown> => {
    try {
        return await apiClient.post("/orders/update-status", payload);
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data?.message || "Failed to update SCR review");
    }
};

export const markOrderUrgent = async (orderId: string): Promise<unknown> => {
    const id = String(orderId || "").trim();
    if (!id || id === "--" || id === "undefined" || id === "null") {
        throw new Error("Invalid Shopify Order ID");
    }
    const cleanId = id.replace(/^#/, "").replace(/\/$/, "");
    return apiClient.request({
        url: `/orders/make-urgent/${cleanId}`,
        method: "POST",
    });
};

export const cancelOrder = async (payload: CancelOrderPayload): Promise<unknown> => {
    try {
        const safePayload = {
            ...payload,
            orderId: payload.orderId ?? "",
        };

        return await apiClient.post("/orders/cancel", safePayload);
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data?.message || "Failed to cancel order");
    }
};

export const markOrderOnHold = async (orderId: string): Promise<unknown> => {
    try {
        return await apiClient.post("/orders/update-status", {
            order_id: orderId,
            mark_on_hold: "1",
        });
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data?.message || "Failed to mark order as on-hold");
    }
};

export const resyncOrderFromShopify = async (orderId: string): Promise<{ message: string }> => {
    try {
        return await apiClient.post<{ message: string }>(`/orders/${orderId}/resync-shopify`, {});
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data?.message || "Failed to re-sync order from Shopify");
    }
};
