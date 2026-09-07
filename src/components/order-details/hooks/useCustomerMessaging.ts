import type { Method } from "axios";
import { sendMessageToCustomer, triggerSixMonthReview } from "../../../api/services/orders/actions";
import type { ApiResponse } from "../types";

export function useCustomerMessaging(
    order: ApiResponse | null,
    isReadOnly: boolean,
    setSending: (v: boolean) => void,
    showModal: (id: string) => void,
    hideModal: () => void,
    buildLogBase: () => any,
    logActivity: (params: any) => Promise<any>
) {
    const handleSendMessage = async (message: string) => {
        if (!order?.sendMessage || !message) return;
        setSending(true);
        showModal("fullScreenLoader");
        try {
            await sendMessageToCustomer({
                ...order.sendMessage,
                method: order.sendMessage.method as Method,
                payload: { ...order.sendMessage.payload, message },
            });
            showModal("customerSuccessModal");
            setTimeout(() => hideModal(), 5000);
            void logActivity({ ...buildLogBase(), action_type: "customer_message_sent", details: "Sent message to customer" });
        } catch (error) {
            console.error("❌ Email Error:", error);
        } finally {
            setSending(false);
        }
    };

    const handleSixMonthAction = async () => {
        if (!order?.sixMonthEmail || isReadOnly) return;
        setSending(true);
        showModal("fullScreenLoader");
        try {
            await triggerSixMonthReview({
                ...order.sixMonthEmail,
                method: order.sixMonthEmail.method as Method,
            });
            showModal("sixMonthSuccessModal");
            void logActivity({ ...buildLogBase(), action_type: "six_month_review_sent", details: "Sent 6-month professional review reminder" });
        } catch (error) {
            console.error("❌ Six-Month Reminder Error:", error);
            hideModal();
        } finally {
            setSending(false);
        }
    };

    return { handleSendMessage, handleSixMonthAction };
}
