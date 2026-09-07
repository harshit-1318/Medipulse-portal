import type { ApiResponse } from "@/components/order-details/types";
import { capitalizeName } from "@/components/order-details/utils";
import { FileText, Mail, UserCheck, Calendar } from "lucide-react";
import { PrescriptionRowItem } from "./PrescriptionRowItem";
import { GpNotificationRowAction } from "./GpNotificationRowAction";

interface PrescriptionDetailsCardProps {
    pharmacistInfo: ApiResponse["pharmacistInfo"];
    sendGpEmail: ApiResponse["sendGpEmail"];
    reviewedBy: string;
    formattedCreatedAt: string;
    onEmailGp: () => void;
    isCancelled?: boolean;
}

export function PrescriptionDetailsCard({
    pharmacistInfo,
    sendGpEmail,
    reviewedBy,
    formattedCreatedAt,
    onEmailGp,
    isCancelled = false,
}: PrescriptionDetailsCardProps) {
    const displayDate = formattedCreatedAt.trim();

    return (
        <div className="order-detail-card p-4 group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100/30 transition-colors" />

            <div className="flex items-center gap-2 mb-2 relative z-10 transition-colors">
                <span className="text-[18px] leading-none flex items-center justify-center shrink-0">📄</span>
                <div className="flex items-baseline gap-1.5">
                    <h3 className="text-[16px] font-semibold text-text-primary leading-none">Prescription</h3>
                    <span className="text-[13px] text-slate-400 font-medium">—</span>
                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider leading-none">MEDICAL DETAILS</p>
                </div>
            </div>

            <div className="space-y-1 flex-1 flex flex-col justify-start relative z-10 w-full">
                <PrescriptionRowItem icon={<FileText size={16} strokeWidth={2.5} />} label="Prescription">
                    {pharmacistInfo?.prescription_pdf ? (
                        <a
                            href={pharmacistInfo.prescription_pdf}
                            target="_blank"
                            rel="noreferrer"
                            className="h-8 px-4 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-all duration-200 ease-in-out cursor-pointer active:scale-95 bg-brand-cyan text-white shadow-sm shadow-brand-cyan/20 hover:bg-brand-teal hover:-translate-y-0.5 hover:shadow-md"
                        >
                            VIEW PRESCRIPTION
                        </a>
                    ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-semibold uppercase tracking-wider shrink-0 bg-red-50 text-red-600 border-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span className="mt-px">Not Prescribed</span>
                        </span>
                    )}
                </PrescriptionRowItem>

                <PrescriptionRowItem icon={<Mail size={16} strokeWidth={2.5} />} label="GP Notification">
                    <GpNotificationRowAction
                        pharmacistInfo={pharmacistInfo}
                        sendGpEmail={sendGpEmail}
                        onEmailGp={onEmailGp}
                        isCancelled={isCancelled}
                    />
                </PrescriptionRowItem>

                <PrescriptionRowItem icon={<UserCheck size={16} strokeWidth={2.5} />} label="Prescribed By">
                    <span className="text-text-primary font-bold text-[13px] tracking-tight text-right truncate shrink-0 max-w-[65%]">
                        {(pharmacistInfo?.generated_by_name || reviewedBy) ? (
                            `${capitalizeName(pharmacistInfo?.generated_by_name || reviewedBy)}${pharmacistInfo?.generated_by_reg_no ? ` (Reg. No: ${pharmacistInfo.generated_by_reg_no})` : ''}`
                        ) : "Not Assigned"}
                    </span>
                </PrescriptionRowItem>

                <PrescriptionRowItem icon={<Calendar size={16} strokeWidth={2.5} />} label="Prescribed On">
                    <span className="text-text-primary font-bold text-[13px] tracking-tight text-right shrink-0 max-w-[65%]">
                        {pharmacistInfo?.createdAt ? (
                             new Intl.DateTimeFormat("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC"
                            }).format(new Date(pharmacistInfo.createdAt)).replace(',', '')
                        ) : (pharmacistInfo?.generated_by_name || reviewedBy) ? displayDate : "Not Assigned"}
                    </span>
                </PrescriptionRowItem>
            </div>
        </div>
    );
}

