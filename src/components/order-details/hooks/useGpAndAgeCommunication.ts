import type { Method } from "axios";
import { sendGpEmail, sendAgeVerification } from "../../../api/services/orders/actions";
import type { ApiResponse } from "../types";

export function useGpAndAgeCommunication(
    order: ApiResponse | null,
    setSending: (s: boolean) => void,
    showModal: (id: string) => void,
    hideModal: () => void,
    buildLogBase: () => any,
    logActivity: (payload: any) => Promise<any>
) {
    const handleSendGpEmail = async (email: string, message: string) => {
        if (!order?.sendGpEmail?.enabled) return;
        setSending(true);
        showModal("fullScreenLoader");
        try {
            const gp = order.sendGpEmail;
            await sendGpEmail({
                actionUrl: gp.actionUrl,
                method: gp.method as Method,
                email,
                message,
            });
            showModal("gpSuccessModal");
            setTimeout(() => hideModal(), 5000);
            void logActivity({ ...buildLogBase(), action_type: "gp_email_sent", details: `Emailed GP clinic: ${email}` });
        } catch (err) {
            console.error("❌ GP Email Error:", err);
        } finally {
            setSending(false);
        }
    };

    const handleSendAgeVerification = async () => {
        if (!order?.ageVerifiedEmail?.enabled) return;
        setSending(true);
        showModal("fullScreenLoader");
        try {
            await sendAgeVerification({
                actionUrl: order.ageVerifiedEmail.actionUrl,
                method: order.ageVerifiedEmail.method as Method,
            });
            showModal("ageVerificationSuccessModal");
            setTimeout(() => hideModal(), 5000);
            void logActivity({ ...buildLogBase(), action_type: "age_verification_sent", details: "Sent age verification request to customer" });
        } catch (error) {
            console.error("❌ Age Verification Error:", error);
            hideModal();
        } finally {
            setSending(false);
        }
    };

    return { handleSendGpEmail, handleSendAgeVerification };
}
