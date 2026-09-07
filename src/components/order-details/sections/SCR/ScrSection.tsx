import { ScrViewMode } from "./components/ScrViewMode";
import { ScrEditMode } from "./components/ScrEditMode";

interface ScrSectionProps {
    isReviewed: boolean;
    scrFlags: {
        consultation_reviewed: boolean;
        image_id_verified: boolean;
        scr_accessed: boolean;
    };
    scrComments: string;
    setScrComments: (v: string) => void;
    reviewedBy: string;
    reviewedAt: string;
    regNo?: string;
    isReadOnly: boolean;
    isCancelled?: boolean;
    handleToggle: (key: any) => void;
    approveChecked: boolean;
    setApproveChecked: (v: boolean) => void;
    onSubmitSCR: () => void;
    onDecline: () => void;
    shopifyOrderId: string;
}

export function ScrSection({
    isReviewed,
    scrFlags,
    scrComments,
    setScrComments,
    reviewedBy,
    reviewedAt,
    regNo,
    isReadOnly,
    isCancelled = false,
    handleToggle,
    approveChecked,
    setApproveChecked,
    onSubmitSCR,
    onDecline,
    shopifyOrderId,
}: ScrSectionProps) {
    return (
        <div id="section-scr" className="order-detail-card group mt-2 p-6!">
            <div className="section-header flex items-center gap-3 mb-6 relative z-10 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl shadow-sm border border-emerald-100/50 transition-transform duration-300 group-hover:scale-105">
                        <span className="text-[20px]">🔐</span>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-[17px] font-semibold text-slate-800 leading-tight">SCR Access</h3>
                        <p className="text-[12px] font-medium text-slate-500 mt-0.5">Medical Compliance</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                {isReviewed ? (
                    <ScrViewMode 
                        scrFlags={scrFlags} 
                        scrComments={scrComments} 
                        reviewedBy={reviewedBy} 
                        reviewedAt={reviewedAt} 
                        regNo={regNo} 
                        shopifyOrderId={shopifyOrderId}
                        isCancelled={isCancelled}
                    />
                ) : (
                    <ScrEditMode
                        scrFlags={scrFlags}
                        scrComments={scrComments}
                        setScrComments={setScrComments}
                        isReadOnly={isReadOnly}
                        isCancelled={isCancelled}
                        shopifyOrderId={shopifyOrderId}
                        handleToggle={handleToggle}
                        approveChecked={approveChecked}
                        setApproveChecked={setApproveChecked}
                        onSubmitSCR={onSubmitSCR}
                        onDecline={onDecline}
                    />
                )}
            </div>
        </div>
    );
}

export { ScrEditActions } from "./components/ScrEditActions";
export default ScrSection;
