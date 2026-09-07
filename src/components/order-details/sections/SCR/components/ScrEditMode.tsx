import { MessageSquare } from "lucide-react";
import { ScrEditActions } from "./ScrEditActions";
import { ScrEditCheckboxGroup } from "./ScrEditCheckboxGroup";

interface ScrEditModeProps {
    scrFlags: {
        consultation_reviewed: boolean;
        image_id_verified: boolean;
        scr_accessed: boolean;
    };
    scrComments: string;
    setScrComments: (v: string) => void;
    isReadOnly: boolean;
    isCancelled?: boolean;
    handleToggle: (key: any) => void;
    approveChecked: boolean;
    setApproveChecked: (v: boolean) => void;
    onSubmitSCR: () => void;
    onDecline: () => void;
    shopifyOrderId: string;
}

export function ScrEditMode({
    scrFlags,
    scrComments,
    setScrComments,
    isReadOnly,
    isCancelled = false,
    handleToggle,
    approveChecked,
    setApproveChecked,
    onSubmitSCR,
    onDecline,
    shopifyOrderId,
}: ScrEditModeProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ScrEditCheckboxGroup
                scrFlags={scrFlags}
                handleToggle={handleToggle}
                isReadOnly={isReadOnly}
                isCancelled={isCancelled}
            />

            <div className="my-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={14} className="text-slate-600" strokeWidth={2.5} />
                    <span className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">Medical Review Comments</span>
                </div>
                <div className="border-l-4 border-l-blue-500 rounded-xl overflow-hidden shadow-sm transition-all duration-300 focus-within:shadow-md">
                    <textarea
                        className="w-full border border-slate-200 border-l-0 rounded-r-xl bg-slate-50 p-4 
                            text-[15px] font-medium text-slate-700 placeholder:text-slate-400
                            outline-none focus:bg-white transition-all min-h-[120px] resize-y disabled:opacity-50"
                        placeholder="Provide additional details if necessary..."
                        rows={3}
                        value={scrComments}
                        onChange={(e) => setScrComments(e.target.value)}
                        disabled={isReadOnly || isCancelled}
                    />
                </div>
            </div>

            <div className="mt-8">
                <ScrEditActions
                    approveChecked={approveChecked}
                    setApproveChecked={setApproveChecked}
                    isReadOnly={isReadOnly}
                    isCancelled={isCancelled}
                    onSubmitSCR={onSubmitSCR}
                    onDecline={onDecline}
                    shopifyOrderId={shopifyOrderId}
                    hasAtLeastOneFlag={Object.values(scrFlags).some((v) => v === true)}
                />
            </div>
        </div>
    );
}

