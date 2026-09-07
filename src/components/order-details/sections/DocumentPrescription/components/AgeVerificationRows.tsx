import { Tag, ShieldCheck } from "lucide-react";

interface AgeVerificationRowsProps {
    ageVerifiedTags: string[];
    hasPendingAgeVerification: boolean;
    isManualVerified: boolean;
    sentAt: string | null;
    sentBy: string | null;
}

export function AgeVerificationRows({
    ageVerifiedTags,
    hasPendingAgeVerification,
    isManualVerified,
    sentAt,
    sentBy,
}: AgeVerificationRowsProps) {
    if (ageVerifiedTags.length === 0) return null;

    return (
        <>
            <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full shrink-0 min-h-[38px]">
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-gray-400 flex items-center justify-center shrink-0 [&>svg]:w-[16px] [&>svg]:h-[16px]">
                        <Tag size={16} strokeWidth={2.5} />
                    </span>
                    <span className="text-text-secondary font-medium text-[13px] shrink-0">Age Verified Tag</span>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                    {ageVerifiedTags.map((tag: string, index: number) => (
                        <span
                            key={index}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md whitespace-nowrap uppercase tracking-wider"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {hasPendingAgeVerification && (
                <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full shrink-0 min-h-[38px]">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-gray-400 flex items-center justify-center shrink-0 [&>svg]:w-[16px] [&>svg]:h-[16px]">
                            <ShieldCheck size={16} strokeWidth={2.5} />
                        </span>
                        <span className="text-text-secondary font-medium text-[13px] shrink-0">Manual Age Verified</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        {isManualVerified ? (
                            <>
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-md whitespace-nowrap uppercase tracking-wider">
                                    ✓ Verified
                                </span>
                                {sentAt && (
                                    <span className="text-[11px] text-text-secondary font-medium">{sentAt}</span>
                                )}
                                {sentBy && (
                                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[160px]" title={sentBy}>{sentBy}</span>
                                )}
                            </>
                        ) : (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-md whitespace-nowrap uppercase tracking-wider">
                                Not Verified
                            </span>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
