import type React from "react";

interface RowProps {
    label: string;
    value: React.ReactNode;
    labelClass?: string;
    valueClass?: string;
    icon?: React.ReactNode;
    multiline?: boolean;
}

export function Row({ label, value, labelClass = "", valueClass = "", icon, multiline = false }: RowProps) {
    return (
        <div className={`flex flex-row ${multiline ? 'items-start' : 'items-center'} justify-between py-2 border-b border-gray-100 last:border-0 w-full shrink-0 min-h-[38px]`}>
            <div className={`flex items-center gap-2 shrink-0 ${multiline ? 'mt-0.5' : ''}`}>
                {icon && <span className="text-gray-400 flex items-center justify-center shrink-0 [&>svg]:w-[16px] [&>svg]:h-[16px]">{icon}</span>}
                <span className={`text-text-secondary font-medium text-[13px] shrink-0 ${labelClass}`}>{label}</span>
            </div>
            <span className={`text-text-primary font-semibold text-[13px] tracking-tight ${multiline ? 'text-left whitespace-normal wrap-break-word py-0.5' : 'text-right truncate shrink-0 max-w-[50%]'} ${valueClass}`}>{value}</span>
        </div>
    );
}
