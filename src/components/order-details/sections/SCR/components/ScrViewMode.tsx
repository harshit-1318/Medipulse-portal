import { CheckCircle2, ShieldCheck, Fingerprint, MessageSquare, ExternalLink } from "lucide-react";
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
    shopifyOrderId: string;
    isCancelled?: boolean;
}

export function ScrViewMode({ scrFlags, scrComments, reviewedBy, reviewedAt, regNo, shopifyOrderId, isCancelled = false }: ScrViewModeProps) {
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

            <div className="mt-8 flex justify-end">
                <a
                    href={`https://admin.shopify.com/orders/${shopifyOrderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={isCancelled ? "Order already cancelled" : "Cancel order in Shopify Admin"}
                    className={`h-10 px-6 rounded-full 
                        text-white text-[12px] font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 
                        flex items-center justify-center gap-2
                        ${isCancelled
                            ? "bg-slate-300 cursor-not-allowed opacity-60"
                            : "bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-rose-200 shadow-md"}`}
                    onClick={(e) => isCancelled && e.preventDefault()}
                >
                    <ExternalLink size={14} strokeWidth={2.5} />
                    CANCEL ORDER
                </a>
            </div>
        </div>
    );
}

