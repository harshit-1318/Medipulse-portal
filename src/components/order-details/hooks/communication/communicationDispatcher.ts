import type { ApiResponse } from "@/components/order-details/types";
import { handleDocumentAction, handleInPersonVideoAction, handlePrescriptionAction, handleVideoAction } from "@/components/order-details/utils";

export async function dispatchCommunicationAction({
    action,
    order,
    showModal,
    hideModal,
    buildLogBase,
    logActivity,
    handleSixMonthAction,
    handleSendAgeVerification,
}: {
    action: string;
    order: ApiResponse;
    showModal: (id: string) => void;
    hideModal: () => void;
    buildLogBase: () => any;
    logActivity: (payload: any) => Promise<any>;
    handleSixMonthAction: () => Promise<void>;
    handleSendAgeVerification: () => Promise<void>;
}) {
    if (action === "video") {
        await handleVideoAction(order, showModal, hideModal);
        void logActivity({ ...buildLogBase(), action_type: "video_consultation_sent", details: "Sent live video consultation" });
    } else if (action === "in_person_video") {
        await handleInPersonVideoAction(order, showModal, hideModal);
        void logActivity({ ...buildLogBase(), action_type: "in_person_video_consultation_sent", details: "Sent in-person video consultation" });
    } else if (action === "prescription") {
        await handlePrescriptionAction(order, showModal, hideModal);
        void logActivity({ ...buildLogBase(), action_type: "prescription_reminder_sent", details: "Sent Rx reminder" });
    } else if (action === "document") {
        await handleDocumentAction(order, showModal, hideModal);
        void logActivity({ ...buildLogBase(), action_type: "document_reminder_sent", details: "Sent document reminder (ID + image)" });
    } else if (action === "six_month") {
        await handleSixMonthAction();
    } else if (action === "age_verification") {
        await handleSendAgeVerification();
    }
}
