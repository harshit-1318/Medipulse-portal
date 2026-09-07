import React from 'react';
import { FileText } from 'lucide-react';
import type { ApiResponse } from '@/components/order-details/types';

interface GpNotificationRowActionProps {
    pharmacistInfo: ApiResponse["pharmacistInfo"];
    sendGpEmail: ApiResponse["sendGpEmail"];
    onEmailGp: () => void;
    isCancelled?: boolean;
}

export const GpNotificationRowAction: React.FC<GpNotificationRowActionProps> = ({
    pharmacistInfo,
    sendGpEmail,
    onEmailGp,
    isCancelled = false,
}) => (
    <div className="flex items-center gap-2 shrink-0">
        {pharmacistInfo?.gp_pdf && (
            <a
                href={pharmacistInfo.gp_pdf}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-4 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-all duration-200 ease-in-out cursor-pointer active:scale-95 bg-white text-text-primary border border-slate-200 shadow-sm shadow-slate-200/50 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md"
            >
                <FileText size={13} strokeWidth={2.5} className="text-slate-400" />
                <span>VIEW LETTER</span>
            </a>
        )}
        {sendGpEmail?.enabled && (
            <button
                type="button"
                onClick={onEmailGp}
                disabled={isCancelled}
                className="h-8 px-4 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-all duration-200 ease-in-out cursor-pointer active:scale-95 bg-brand-cyan text-white shadow-sm shadow-brand-cyan/20 hover:bg-brand-teal hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:pointer-events-none disabled:grayscale"
            >
                NOTIFY GP
            </button>
        )}
    </div>
);
