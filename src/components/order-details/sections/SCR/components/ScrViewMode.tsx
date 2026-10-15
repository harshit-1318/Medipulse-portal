import { CheckCircle2, ShieldCheck, Fingerprint, MessageSquare } from "lucide-react";
import { ScrFlagRow } from "./ScrFlagRow";
import { ScrReviewerMeta } from "./ScrReviewerMeta";

interface ScrViewModeProps {
    scrFlags: {
        consultation_reviewed: boolean;
        image_id_verified: boolean;
        scr_accessed: boolean;
    };
    scrComments: string;
    reviewedBy: string;
    reviewedAt: string;
    regNo?: string;
    shopifyOrderId?: string;
    isCancelled?: boolean;
}

export function ScrViewMode({ scrFlags, scrComments, reviewedBy, reviewedAt, regNo, isCancelled = false }: ScrViewModeProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC"
        }).format(date).replace(',', '');
    };

    return (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500 flex flex-col w-full">
            <div className="flex flex-col w-full space-y-2">
                <ScrFlagRow
                    icon={<CheckCircle2 size={16} strokeWidth={2.5} />}
                    title="Consultation Reviewed"
                    label={scrFlags.consultation_reviewed ? "Reviewed" : "Pending"}
                    success={scrFlags.consultation_reviewed}
                />
                <ScrFlagRow
                    icon={<ShieldCheck size={16} strokeWidth={2.5} />}
                    title="Image & ID Verified"
                    label={scrFlags.image_id_verified ? "Verified" : "Pending"}
                    success={scrFlags.image_id_verified}
                />
                <ScrFlagRow
                    icon={<Fingerprint size={16} strokeWidth={2.5} />}
                    title="SCR Accessed"
                    label={scrFlags.scr_accessed ? "Accessed" : "Restricted"}
                    success={scrFlags.scr_accessed}
                />

                <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 border-l-4 border-l-blue-500 shadow-sm transition-all duration-300 hover:bg-slate-100/50">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare size={14} className="text-slate-600" strokeWidth={2.5} />
                        <span className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">Further Comments</span>
                    </div>
                    {scrComments?.trim() ? (
                        <div className="text-[15px] text-slate-900 leading-relaxed whitespace-pre-wrap font-medium">
                            {scrComments.trim()}
                        </div>
                    ) : (
                        <div className="text-[14px] text-slate-400 italic font-medium">
                            No additional comments provided
                        </div>
                    )}
                </div>

                <ScrReviewerMeta
                    reviewedBy={reviewedBy}
                    reviewedAt={reviewedAt}
                    regNo={regNo}
                    formatDate={formatDate}
                />
            </div>

            {isCancelled && (
                <div className="mt-8 flex justify-end">
                    <span className="h-9 px-5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[12px] font-bold uppercase tracking-wider flex items-center justify-center">
                        Order Cancelled
                    </span>
                </div>
            )}
        </div>
    );
}

