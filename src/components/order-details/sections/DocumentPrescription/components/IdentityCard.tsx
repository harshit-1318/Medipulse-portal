import { DocumentRow } from "@/components/order-details/components/DocumentRow";
import type { ApiResponse } from "@/components/order-details/types";
import { IdCard, Camera, Video } from "lucide-react";
import { IdentityDocumentRows } from "./IdentityDocumentRows";
import { AgeVerificationRows } from "./AgeVerificationRows";
import { useIdentityCardData } from "../hooks/useIdentityCardData";

interface IdentityCardProps {
    customerDocuments: ApiResponse["customerDocuments"];
    consultationFlags: ApiResponse["consultationFlags"];
    sixMonthReview: ApiResponse["sixMonthReview"];
    handleView: (url?: string | null) => void;
    handleViewPrescriptionList: () => void;
    onViewVideoRecordings: () => void;
    isWeightLoss: boolean;
    customerMeta?: any;
    orderDocumentFilter?: any[];
    order?: any;
}

export function IdentityCard({
    customerDocuments,
    consultationFlags,
    sixMonthReview,
    handleView,
    handleViewPrescriptionList,
    onViewVideoRecordings,
    customerMeta,
    orderDocumentFilter,
    order,
}: IdentityCardProps) {
    const {
        idCard,
        fullPhoto,
        hasVideo,
        videoRequestSent,
        ageVerifiedTags,
        hasPendingAgeVerification,
        hasMounjaroOrWegovy,
        isManualVerified,
        sentAt,
        sentBy,
    } = useIdentityCardData({
        customerDocuments,
        consultationFlags,
        customerMeta,
        orderDocumentFilter,
        order,
    });

    return (
        <div className="order-detail-card p-4 group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100/30 transition-colors" />

            <div className="flex items-center gap-2 mb-2 relative z-10 transition-colors">
                <span className="text-[18px] leading-none">🪪</span>
                <div className="flex items-baseline gap-1.5">
                    <h3 className="text-[16px] font-semibold text-text-primary uppercase leading-none tracking-tight">Verification</h3>
                    <span className="text-[13px] text-slate-400 font-medium">—</span>
                    <p className="text-[11px] font-medium text-text-secondary uppercase tracking-widest leading-none">ID & Identity</p>
                </div>
            </div>

            <div className="space-y-1 flex-1 flex flex-col justify-start relative z-10 w-full overflow-hidden">
                <DocumentRow label="Customer's ID" icon={<IdCard size={16} strokeWidth={2.5} />} available={idCard} onView={() => handleView(typeof idCard === 'string' ? idCard : null)} fallbackText="Not Uploaded" />
                <DocumentRow label="Customer's Full Photo" icon={<Camera size={16} strokeWidth={2.5} />} available={fullPhoto} onView={() => handleView(typeof fullPhoto === 'string' ? fullPhoto : null)} fallbackText="Not Uploaded" />

                <IdentityDocumentRows customerDocuments={customerDocuments} sixMonthReview={sixMonthReview} handleViewPrescriptionList={handleViewPrescriptionList} />

                <DocumentRow
                    label="Customer's Video Recording"
                    icon={<Video size={16} strokeWidth={2.5} />}
                    available={hasVideo}
                    onView={onViewVideoRecordings}
                    fallbackText={videoRequestSent ? undefined : "Not Uploaded"}
                    pendingText={videoRequestSent ? "Awaiting recording" : undefined}
                />

                {!hasMounjaroOrWegovy && (
                    <AgeVerificationRows
                        ageVerifiedTags={ageVerifiedTags}
                        hasPendingAgeVerification={hasPendingAgeVerification}
                        isManualVerified={isManualVerified}
                        sentAt={sentAt}
                        sentBy={sentBy}
                    />
                )}
            </div>
        </div>
    );
}

