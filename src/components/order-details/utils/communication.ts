import type { Method } from "axios";
import {
    triggerDocumentReminder,
    triggerPrescriptionReminder,
    triggerVideoConsultation,
    triggerInPersonVideoConsultation,
} from "../../../api/services/orders/actions";
import type { ApiResponse } from "../types";

export async function handleVideoAction(order: ApiResponse, showModal: (id: string) => void, hideModal: () => void) {
    showModal("fullScreenLoader");
    await triggerVideoConsultation(String(order.orderInfo.shopifyOrderId));
    showModal("videoSuccessModal");
    setTimeout(() => hideModal(), 5000);
}

export async function handleInPersonVideoAction(
    order: ApiResponse,
    showModal: (id: string) => void,
    hideModal: () => void,
) {
    showModal("fullScreenLoader");
    await triggerInPersonVideoConsultation(String(order.orderInfo.shopifyOrderId));
    showModal("inPersonVideoSuccessModal");
    setTimeout(() => hideModal(), 5000);
}

export async function handlePrescriptionAction(
    order: ApiResponse,
    showModal: (id: string) => void,
    hideModal: () => void,
) {
    showModal("fullScreenLoader");

    const config = order.sendPrescriptionReminder;
    const shopifyId = String(order.orderInfo.shopifyOrderId);

    let finalUrl = config.actionUrl;
    if (!finalUrl.includes(shopifyId)) {
        finalUrl = finalUrl.endsWith("/") ? `${finalUrl}${shopifyId}` : `${finalUrl}/${shopifyId}`;
    }

    const payload: any = {
        ...config.payload,
        order_id: Number(order.orderInfo.shopifyOrderId),
        internal_id: order.orderInfo.orderId,
    };

    await triggerPrescriptionReminder({
        ...config,
        method: config.method as Method,
        actionUrl: finalUrl,
        payload,
    });

    showModal("prescriptionSuccessModal");
    setTimeout(() => hideModal(), 5000);
}

export async function handleDocumentAction(order: ApiResponse, showModal: (id: string) => void, hideModal: () => void) {
    showModal("fullScreenLoader");

    const config = order.sendDocumentReminder;
    const shopifyId = String(order.orderInfo.shopifyOrderId);

    let finalUrl = config.actionUrl;
    if (!finalUrl.includes(shopifyId)) {
        finalUrl = finalUrl.endsWith("/") ? `${finalUrl}${shopifyId}` : `${finalUrl}/${shopifyId}`;
    }

    await triggerDocumentReminder({
        ...config,
        method: config.method as Method,
        actionUrl: finalUrl,
        payload: config.payload,
    });

    showModal("documentSuccessModal");
    setTimeout(() => hideModal(), 5000);
}
