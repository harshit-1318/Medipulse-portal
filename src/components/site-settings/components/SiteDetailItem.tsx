import React from "react";
import { KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";

interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
    loading?: boolean;
    copyable?: boolean;
    external?: boolean;
    iconBg: string;
}

export function SiteDetailItem({ icon, label, value, loading, copyable, external, iconBg }: DetailItemProps) {
    if (loading) return <div className="h-20 rounded-xl bg-slate-50 animate-pulse border border-slate-100" />;
    
    return (
        <div className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100/80 transition-all hover:bg-slate-50">
            <div className={`p-2.5 rounded-lg shrink-0 ${iconBg} shadow-xs border border-white/50`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <div className="flex items-center justify-between overflow-hidden relative">
                    {external && value ? (
                        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline truncate">{value}</a>
                    ) : <span className="text-[14px] font-bold text-slate-800 truncate" title={value}>{value || '-'}</span>}
                    
                    {copyable && value && (
                        <button onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied!"); }} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 bg-linear-to-l from-slate-50 via-slate-50 to-transparent pl-4">
                            <KeyRound size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
