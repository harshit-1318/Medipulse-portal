import { ScrSection } from "../SCR";
import { ResyncSection } from "../Resync";

interface ClinicalSectionsProps {
    order: any;
    orderId: string;
    isReadOnly: boolean;
    scrState: any;
    showScr: boolean;
    canResync: boolean;
    isResyncing: boolean;
    resyncSuccess: boolean;
    resyncError: any;
    handleResync: (orderId: string) => void | Promise<void>;
    isCancelled: boolean;
}

export function ClinicalSections({
    order,
    orderId,
    isReadOnly,
    scrState,
    showScr,
    canResync,
    isResyncing,
    resyncSuccess,
    resyncError,
    handleResync,
    isCancelled,
}: ClinicalSectionsProps) {
    return (
        <>
            {showScr && (
                <ScrSection
                    isReviewed={scrState.isReviewed}
                    scrFlags={scrState.scrFlags}
                    scrComments={scrState.scrComments}
                    setScrComments={scrState.setScrComments}
                    reviewedBy={scrState.reviewedBy}
                    reviewedAt={scrState.reviewedAt}
                    regNo={scrState.regNo}
                    isReadOnly={isReadOnly}
                    isCancelled={isCancelled}
                    shopifyOrderId={order.orderInfo.shopifyOrderId.toString()}
                    handleToggle={scrState.handleToggleScr}
                    approveChecked={scrState.approveChecked}
                    setApproveChecked={scrState.setApproveChecked}
                    onSubmitSCR={scrState.handleSubmitSCR}
                    onDecline={() => scrState.setShowDeclinePopup(true)}
                />
            )}

            {canResync && (
                <ResyncSection
                    orderId={orderId}
                    isResyncing={isResyncing}
                    resyncSuccess={resyncSuccess}
                    resyncError={resyncError}
                    resyncedAt={order?.orderInfo?.resyncedAt}
                    handleResync={handleResync}
                />
            )}
        </>
    );
}
