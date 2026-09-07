import { useState } from "react";
import type { ApiResponse } from "@/components/order-details/types";
import { logActivity } from "@/api/services/activity-log";
import { useUserStore } from '@/store';
import { dispatchCommunicationAction } from "./communicationDispatcher";
import { useGpAndAgeCommunication } from "./useGpAndAgeCommunication";
import { useCustomerMessaging } from "./useCustomerMessaging";

export function useCommunicationActions(
    order: ApiResponse | null,
    isReadOnly: boolean,
    showModal: (id: string) => void,
    hideModal: () => void,
) {
    const [sending, setSending] = useState(false);

    const buildLogBase = () => {
        const user = useUserStore.getState().user;
        return {
            view: "order_details",
            object_guid: order?.orderInfo?.orderId ?? "",
            user_email: user?.email,
            user_name: user?.username,
        };
    };

    const { handleSendGpEmail, handleSendAgeVerification } = useGpAndAgeCommunication(
        order,
        setSending,
        showModal,
        hideModal,
        buildLogBase,
        logActivity
    );

    const { handleSendMessage, handleSixMonthAction } = useCustomerMessaging(
        order,
        isReadOnly,
        setSending,
        showModal,
        hideModal,
        buildLogBase,
        logActivity
    );

    const handleCommunicationAction = async (action: string) => {
        if (isReadOnly || !order || sending) return;
        if (action === "email_customer") { showModal("oc-popup"); return; }
        if (action === "email_gp") { showModal("gp-popup"); return; }
        setSending(true);
        try {
            await dispatchCommunicationAction({
                action,
                order,
                showModal,
                hideModal,
                buildLogBase,
                logActivity,
                handleSixMonthAction,
                handleSendAgeVerification,
            });
        } catch (err) {
            console.error("Communication Action Error:", err);
            hideModal();
        } finally {
            setSending(false);
        }
    };

    return { sending, handleSendMessage, handleSendGpEmail, handleCommunicationAction };
}
