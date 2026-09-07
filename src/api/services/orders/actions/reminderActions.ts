import type { Method } from "axios";
import apiClient from "../../../apiClient";

export interface PrescriptionReminderConfig { actionUrl: string; method: Method; payload: Record<string, unknown>; }
export interface MessageToCustomerConfig { enabled: boolean; actionUrl: string; method: Method; payload: { id?: string | number; message: string; }; }
export interface DocumentReminderConfig { enabled: boolean; actionUrl: string; method: Method; payload: Record<string, unknown>; }
export interface SixMonthReviewConfig { actionUrl: string; method: Method; payload: Record<string, unknown>; }

export const triggerPrescriptionReminder = async (config: PrescriptionReminderConfig) => {
    return apiClient.request({ url: config.actionUrl, method: config.method, data: config.payload });
};

export const sendMessageToCustomer = async (config: MessageToCustomerConfig) => {
    if (!config.enabled) throw new Error("Messaging is disabled for this order!");
    if (!config.payload?.message?.trim()) throw new Error("Message cannot be empty!");
    return apiClient.request({ url: config.actionUrl, method: config.method, data: { message: config.payload.message } });
};

export const triggerDocumentReminder = async (config: DocumentReminderConfig) => {
    if (!config?.enabled) throw new Error("Document Reminder is disabled!");
    return apiClient.request({ url: config.actionUrl, method: config.method, data: config.payload });
};

export const triggerSixMonthReview = async (config: SixMonthReviewConfig) => {
    return apiClient.request({ url: config.actionUrl, method: config.method as Method, data: config.payload });
};
