import React from 'react';
import { UserRound, Calendar } from 'lucide-react';
import { capitalizeName } from '@/components/order-details/utils';

interface ScrReviewerMetaProps {
    reviewedBy: string;
    reviewedAt: string;
    regNo?: string;
    formatDate: (d: string) => string;
}

export const ScrReviewerMeta: React.FC<ScrReviewerMetaProps> = ({
    reviewedBy,
    reviewedAt,
    regNo,
    formatDate,
}) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500 text-[14.5px] font-medium">
                <UserRound size={18} strokeWidth={2.5} />
                <span>Reviewed By</span>
            </div>
            <span className="text-[16px] font-bold text-slate-900 tracking-tight text-right">
                {reviewedBy ? capitalizeName(reviewedBy) : "Not Assigned"} {regNo ? `(Reg. No: ${regNo})` : ""}
            </span>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500 text-[14.5px] font-medium">
                <Calendar size={18} strokeWidth={2.5} />
                <span>Reviewed At</span>
            </div>
            <span className="text-[16px] font-bold text-slate-900 tracking-tight text-right">{formatDate(reviewedAt)}</span>
        </div>
    </div>
);
