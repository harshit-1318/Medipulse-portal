import React, { useState } from "react";
import { ActionButton } from "@/components/order-details/components/ActionButton";
import type { ApiResponse } from "@/components/order-details/types";
import { SendSurveyModal } from "@/components/surveys";

interface Props {
    order: ApiResponse;
    isReadOnly: boolean;
    isCancelled: boolean;
    isSending: boolean;
    onAction: (action: string) => void;
}

export const CommunicationActionsGrid: React.FC<Props> = ({ order, isReadOnly, isCancelled, isSending, onAction }) => {
    const [showSurveyModal, setShowSurveyModal] = useState(false);

    const customerId = order.customerInfo?.id;
    const orderId = order.orderInfo?.orderId || order.orderInfo?.shopifyOrderId;
    const hasMounjaroOrWegovy = order.products?.some((p: any) =>
        p.name?.toLowerCase().includes("mounjaro") || p.name?.toLowerCase().includes("wegovy")
    );

    const orderTagsRaw = order.orderInfo?.tags;
    const parsedOrderTags: string[] = Array.isArray(orderTagsRaw)
        ? orderTagsRaw
        : typeof orderTagsRaw === 'string'
            ? orderTagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean)
            : [];
    const hasAgeVerificationTag = parsedOrderTags.some((t: string) => {
        const n = t.toLowerCase().replace(/[\s-_]/g, '');
        return n.includes('pendingageverification');
    });

    return (
        <>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                <ActionButton icon="👥" label=" Live Video Consultation" buttonLabel="Send Live Video Consultation" onClick={() => onAction("video")} disabled={isReadOnly || !order.sendVideoConsultation?.enabled || isCancelled || isSending} isCancelled={isCancelled} />
                <ActionButton icon="💊" label=" Previous Prescription Reminder" buttonLabel="Send Previous Prescription Reminder" onClick={() => onAction("prescription")} disabled={isReadOnly || !order.sendPrescriptionReminder?.enabled || isCancelled || isSending} isCancelled={isCancelled} />
                <ActionButton icon="📑" label="Document Request" buttonLabel="Send Document Reminder (ID+Image)" onClick={() => onAction("document")} disabled={isReadOnly || !order.sendDocumentReminder?.enabled || isCancelled || isSending} isCancelled={isCancelled} />
                {order.sixMonthEmail && (
                    <ActionButton icon="⏰" label="6-Month Review" buttonLabel="Send 6-Month Review Reminder" onClick={() => onAction("six_month")} disabled={isReadOnly || !order.sixMonthEmail.enabled || isCancelled || isSending} isCancelled={isCancelled} />
                )}
                {/* TODO: Enable when ready
                <ActionButton icon="🏥" label="In Person Video Consultation" buttonLabel="Send In Person Video" onClick={() => onAction("in_person_video")} disabled={isReadOnly || isCancelled} isCancelled={isCancelled} />
                */}
                <ActionButton icon="👤" label="Customer Message" buttonLabel="Contact Customer" onClick={() => onAction("email_customer")} disabled={isReadOnly || !order.sendMessage?.enabled || isCancelled} isCancelled={isCancelled} />
                <ActionButton icon="🩺" label="GP Correspondence" buttonLabel="Email GP Clinic" onClick={() => onAction("email_gp")} disabled={isReadOnly || !order.sendGpEmail?.enabled || isCancelled} isCancelled={isCancelled} />
                {!hasMounjaroOrWegovy && order.ageVerifiedEmail && hasAgeVerificationTag && (
                    <ActionButton icon="🪪" label="Age Verification" buttonLabel="Ask Age Verification" onClick={() => onAction("age_verification")} disabled={isReadOnly || !order.ageVerifiedEmail.enabled || isCancelled || isSending} isCancelled={isCancelled} />
                )}
                {/* TODO: Enable when ready
                <ActionButton icon="📋" label="Send Survey" buttonLabel="Send Survey to Patient" onClick={() => setShowSurveyModal(true)} disabled={isReadOnly || isCancelled || !customerId} isCancelled={isCancelled} />
                */}
            </div>

            {/* TODO: Enable when ready
            {showSurveyModal && customerId && (
                <SendSurveyModal
                    customerId={String(customerId)}
                    orderId={orderId ? String(orderId) : undefined}
                    onClose={() => setShowSurveyModal(false)}
                />
            )}
            */}
        </>
    );
};
