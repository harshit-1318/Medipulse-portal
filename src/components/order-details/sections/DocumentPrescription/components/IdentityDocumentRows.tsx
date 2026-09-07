import { FileText, Package, Clock } from "lucide-react";
import { Row } from "@/components/order-details/components";

interface Props {
    customerDocuments: any;
    sixMonthReview: any;
    handleViewPrescriptionList: () => void;
}

export const IdentityDocumentRows: React.FC<Props> = ({ customerDocuments, sixMonthReview, handleViewPrescriptionList }) => {
    return (
        <>
            <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full shrink-0 min-h-[38px]">
                <div className="flex items-center gap-2 shrink-0">
                    <FileText size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                    <span className="text-text-secondary font-medium text-[13px] shrink-0">Previous Prescriptions</span>
                </div>
                {(customerDocuments?.previous_prescriptions_count ?? customerDocuments?.previous_prescriptions?.length ?? 0) > 0 ? (
                    <button 
                        type="button" 
                        className="h-8 px-4 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-all duration-200 cursor-pointer active:scale-95 bg-brand-cyan text-white shadow-sm hover:bg-brand-teal hover:-translate-y-0.5" 
                        onClick={handleViewPrescriptionList}
                    >
                        View all ({customerDocuments.previous_prescriptions_count ?? customerDocuments.previous_prescriptions.length})
                    </button>
                ) : <StatusBadge text="Not Uploaded" color="red" />}
            </div>

            <Row label="Total Pens Purchased" icon={<Package size={16} strokeWidth={2.5} />} value={sixMonthReview?.totalPens ?? 0} />

            <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full shrink-0 min-h-[38px]">
                <div className="flex items-center gap-2 shrink-0">
                    <Clock size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                    <span className="text-text-secondary font-medium text-[13px] shrink-0">6–Month Review Email</span>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                    {sixMonthReview?.emailSent ? <StatusBadge text="Email Sent" color="emerald" /> : <StatusBadge text="Not Uploaded" color="red" />}
                    {sixMonthReview?.sentAt && (
                        <span className="text-[11px] text-gray-400">
                            {new Date(sixMonthReview.sentAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
};

function StatusBadge({ text, color }: { text: string, color: 'red' | 'emerald' }) {
    const colors = {
        red: "bg-red-50 text-red-600",
        emerald: "bg-emerald-50 text-emerald-700"
    };
    const dotColors = {
        red: "bg-red-500",
        emerald: "bg-emerald-500"
    };
    return (
        <span className={`inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-semibold uppercase tracking-wider shrink-0 ${colors[color]} border-0`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColors[color]}`} />
            <span className="mt-px">{text}</span>
        </span>
    );
}
