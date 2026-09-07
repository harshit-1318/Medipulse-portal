import type { Method } from "axios";
import apiClient from "../../../apiClient";

export interface GPMessageParams { actionUrl: string; method?: Method; email: string; message: string; }

export const triggerVideoConsultation = async (order_id: string) => {
    return apiClient.request({ url: `/video/create-room/${order_id}`, method: "GET" });
};

export const triggerInPersonVideoConsultation = async (orderId: string) => {
    return apiClient.request({ url: `/video/create-in-person-room/${orderId}`, method: "GET" });
};

export const sendGpEmail = async (params: GPMessageParams) => {
    const { actionUrl, method = "POST", email, message } = params;
    const gp_email = email?.trim();
    const msg = message?.trim();
    if (!gp_email) throw new Error("GP Email address cannot be empty!");
    if (!msg) throw new Error("Message cannot be empty!");
    return apiClient.request({ url: actionUrl, method: method, data: { gp_email, message: msg } });
};

export interface AgeVerificationConfig { actionUrl: string; method?: Method; }

export const sendAgeVerification = async (config: AgeVerificationConfig) => {
    if (!config.actionUrl) throw new Error("Age verification actionUrl is missing!");
    return apiClient.request({ url: config.actionUrl, method: config.method ?? "POST" });
};
