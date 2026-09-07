import { InfoCards } from "../InfoCards";
import { DocumentPrescriptionSection } from "../DocumentPrescription";
import { ConsultationSection } from "../Consultation";
import { CommunicationSection } from "../Communication";
import { InternalNotesSection } from "../InternalNotes";
import { ActivityLogsSection } from "../ActivityLogs";
import { useAutoResyncOrder } from "@/components/order-details/hooks/useAutoResyncOrder";
import { useOrderDetailsFlags } from "@/components/order-details/hooks/useOrderDetailsFlags";
import { ClinicalSections } from "./ClinicalSections";

interface OrderDetailsMainContentProps {
    order: any;
    orderId: string;
    isReadOnly: boolean;
    scrState: any;
    commActions: any;
    imageSlider: any;
    showModal: (name: string) => void;
    formattedCreatedAt: string;
}

export const OrderDetailsMainContent = ({
    order,
    orderId,
    isReadOnly,
    scrState,
    commActions,
    imageSlider,
    showModal,
    formattedCreatedAt,
}: OrderDetailsMainContentProps) => {
    const { role, canResync, isLoading: isResyncing, isSuccess: resyncSuccess, error: resyncError, handleResync } =
        useAutoResyncOrder(order, orderId);

    const { isOnHold, isCancelled, isClinical, isWeightLoss, hasPrescription, isCustomerSupport, isParked } =
        useOrderDetailsFlags(order, role);

    const showScr = !isCustomerSupport && (isOnHold || isClinical || hasPrescription);

    return (
        <div className="space-y-3">
            <InfoCards
                orderInfo={order.orderInfo}
                customerInfo={order.customerInfo}
                products={order.products}
                formattedCreatedAt={formattedCreatedAt}
                repeatedOrders={order.repeatedOrders}
                lastPreviousOrder={order.lastPreviousOrder}
            />
            <DocumentPrescriptionSection
                order={order}
                handleView={imageSlider.handleView}
                handleViewPrescriptionList={() => showModal("prescriptionsModal")}
                formattedCreatedAt={formattedCreatedAt}
                onEmailGp={() => showModal("gp-popup")}
                reviewedBy={scrState.reviewedBy}
                onViewVideoRecordings={() => showModal("videoRecordingsModal")}
                isWeightLoss={isWeightLoss}
                isCancelled={isCancelled}
            />
            <ConsultationSection products={order.products} repeatedOrders={order.repeatedOrders ?? 0} />
            <CommunicationSection
                order={order}
                isReadOnly={isReadOnly}
                isSmsSent={!!order.consultationFlags.sms_sent}
                isPostalSent={!!order.consultationFlags.postal_sent}
                isSending={commActions.sending}
                onAction={commActions.handleCommunicationAction}
            />
            <InternalNotesSection
                orderId={order.orderInfo.shopifyOrderId.toString()}
                isCancelled={isCancelled}
                isParked={isParked}
            />

            <ClinicalSections
                order={order}
                orderId={orderId}
                isReadOnly={isReadOnly}
                scrState={scrState}
                showScr={showScr}
                canResync={canResync}
                isResyncing={isResyncing}
                resyncSuccess={resyncSuccess}
                resyncError={resyncError}
                handleResync={handleResync}
                isCancelled={isCancelled}
            />

            <ActivityLogsSection activityLogs={order.activityLogs} />
        </div>
    );
};
