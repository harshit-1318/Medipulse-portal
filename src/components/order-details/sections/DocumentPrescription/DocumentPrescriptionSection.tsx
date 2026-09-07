import type { ApiResponse } from "@/components/order-details/types";
import { IdentityCard } from "./components/IdentityCard";
import { PrescriptionDetailsCard } from "./components/PrescriptionDetailsCard";

interface DocumentPrescriptionSectionProps {
    order: ApiResponse;
    handleView: (url?: string | null) => void;
    handleViewPrescriptionList: () => void;
    formattedCreatedAt: string;
    onEmailGp: () => void;
    reviewedBy: string;
    onViewVideoRecordings: () => void;
    isWeightLoss: boolean;
    isCancelled?: boolean;
}

export function DocumentPrescriptionSection({
    order,
    handleView,
    handleViewPrescriptionList,
    formattedCreatedAt,
    onEmailGp,
    reviewedBy,
    onViewVideoRecordings,
    isWeightLoss,
    isCancelled = false,
}: DocumentPrescriptionSectionProps) {
    const { customerDocuments, consultationFlags, sixMonthReview, pharmacistInfo, sendGpEmail, customerMeta, orderDocumentFilter } = order;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <IdentityCard
                order={order}
                customerDocuments={customerDocuments}
                consultationFlags={consultationFlags}
                sixMonthReview={sixMonthReview}
                handleView={handleView}
                handleViewPrescriptionList={handleViewPrescriptionList}
                onViewVideoRecordings={onViewVideoRecordings}
                isWeightLoss={isWeightLoss}
                customerMeta={customerMeta}
                orderDocumentFilter={orderDocumentFilter}
            />

            <PrescriptionDetailsCard
                pharmacistInfo={pharmacistInfo}
                sendGpEmail={sendGpEmail}
                reviewedBy={reviewedBy}
                formattedCreatedAt={formattedCreatedAt}
                onEmailGp={onEmailGp}
                isCancelled={isCancelled}
            />
        </div>
    );
}

export default DocumentPrescriptionSection;
