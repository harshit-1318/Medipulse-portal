import { DeclineModal } from "./decline";
import { EmailCustomerModal, EmailGpModal } from "./communication";
import { ImagePreviewModal, VideoRecordingsModal, PreviousPrescriptionsModal } from "./media";
import { SuccessModal, FullScreenLoader } from "./feedback";
import type { ApiResponse } from "@/components/order-details/types";

interface OrderDetailsModalsProps {
    order: ApiResponse;
    activeModal: string | null;
    hideModal: () => void;
    handleSendMessage: (msg: string) => Promise<void>;
    handleSendGpEmail: (email: string, msg: string) => Promise<void>;
    scrState: any;
    imageSlider: any;
}

const SUCCESS_MODALS = [
    { id: "videoSuccessModal", title: "Video Consultation Created", message: "Email has been successfully sent.", icon: "🎥" },
    { id: "prescriptionSuccessModal", title: "Prescription Reminder Sent", message: "The prescription reminder has been delivered successfully.", icon: "💊", iconBg: "bg-blue-50", iconBorder: "border-blue-200" },
    { id: "documentSuccessModal", title: "Document Reminder Sent", message: "The document reminder email has been successfully sent.", icon: "📑", iconBg: "bg-amber-50", iconBorder: "border-amber-200" },
    { id: "customerSuccessModal", title: "Message Sent", message: "The customer has received your message.", icon: "👤", iconBg: "bg-blue-50", iconBorder: "border-blue-200" },
    { id: "gpSuccessModal", title: "GP Email Sent", message: "The GP has successfully received your message.", icon: "🩺", iconBg: "bg-blue-50", iconBorder: "border-blue-200" },
    { id: "cancelSuccessModal", title: "Order Cancelled", message: "The order has been successfully cancelled.", icon: "✖", iconBg: "bg-rose-50", iconBorder: "border-rose-200" },
    { id: "scrSuccessModal", title: "SCR Updated", message: "Your SCR review has been successfully submitted.", icon: "✔" },
    { id: "sixMonthSuccessModal", title: "Reminder Sent", message: "The 6-month review reminder has been sent.", icon: "⏰", iconBg: "bg-indigo-50", iconBorder: "border-indigo-200" },
    { id: "inPersonVideoSuccessModal", title: "In Person Video Consultation Created", message: "Email has been successfully sent.", icon: "🏥" },
    { id: "ageVerificationSuccessModal", title: "Age Verification Sent", message: "The age verification request has been sent to the customer.", icon: "🪪", iconBg: "bg-indigo-50", iconBorder: "border-indigo-200" },
];

export function OrderDetailsModals({
    order,
    activeModal,
    hideModal,
    handleSendMessage,
    handleSendGpEmail,
    scrState,
    imageSlider,
}: OrderDetailsModalsProps) {
    return (
        <>
            {activeModal === "fullScreenLoader" && <FullScreenLoader />}
            {activeModal === "oc-popup" && <EmailCustomerModal order={order} onClose={hideModal} onSend={handleSendMessage} />}
            {activeModal === "gp-popup" && <EmailGpModal order={order} onClose={hideModal} onSend={handleSendGpEmail} />}
            {scrState.showDeclinePopup && (
                <DeclineModal
                    onClose={() => scrState.setShowDeclinePopup(false)}
                    onCancelOrder={scrState.handleCancelOrder}
                    cancelReason={scrState.cancelReason}
                    setCancelReason={scrState.setCancelReason}
                    cancelStaffNote={scrState.cancelStaffNote}
                    setCancelStaffNote={scrState.setCancelStaffNote}
                />
            )}
            {SUCCESS_MODALS.map((modal) => (
                <SuccessModal
                    key={modal.id}
                    id={modal.id}
                    title={modal.title}
                    message={modal.message}
                    icon={modal.icon}
                    onClose={hideModal}
                    iconBg={modal.iconBg}
                    iconBorder={modal.iconBorder}
                    isVisible={activeModal === modal.id}
                />
            ))}
            {imageSlider.previewImg && (
                <ImagePreviewModal
                    previewImg={imageSlider.previewImg}
                    imageList={imageSlider.imageList}
                    currentIndex={imageSlider.currentIndex}
                    setCurrentIndex={imageSlider.setCurrentIndex}
                    setPreviewImg={imageSlider.setPreviewImg}
                />
            )}
            {activeModal === "videoRecordingsModal" && (
                <VideoRecordingsModal 
                    shopifyId={String(order.orderInfo.shopifyOrderId)} 
                    orderId={order.orderInfo.orderId}
                    recordings={order.customerDocuments?.video_recordings ?? []} 
                    onClose={hideModal} 
                />
            )}
            {activeModal === "prescriptionsModal" && (
                <PreviousPrescriptionsModal 
                    urls={order.customerDocuments?.previous_prescriptions ?? []} 
                    onClose={hideModal} 
                />
            )}
        </>
    );
}
