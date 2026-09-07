import React from 'react';

interface StatusIndicatorProps {
    label: string;
    success: boolean;
}

const StatusIndicator = ({ label, success }: StatusIndicatorProps) => (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight shadow-sm border ${
        success 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' 
            : 'bg-rose-50 text-rose-700 border-rose-100/50'
    }`}>
        <div className={`h-2 w-2 rounded-full shrink-0 ${success ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <span>{label}</span>
    </div>
);

interface ScrFlagRowProps {
    icon: React.ReactNode;
    title: string;
    label: string;
    success: boolean;
}

export function ScrFlagRow({ icon, title, label, success }: ScrFlagRowProps) {
    return (
        <div className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors group/row">
            <div className="flex items-center gap-3">
                <span className="text-slate-400 group-hover/row:text-emerald-500 transition-colors">
                    {icon}
                </span>
                <span className="text-[14px] font-medium text-slate-700">{title}</span>
            </div>
            <StatusIndicator label={label} success={success} />
        </div>
    );
}
