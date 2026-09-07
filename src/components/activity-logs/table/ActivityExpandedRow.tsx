import { useState } from 'react';
import { Check, Copy, Info } from "lucide-react";
import { HighlightText } from "../utils/HighlightText";
import { m } from "framer-motion";
import type { ActivityLogType } from "@/api/services/log/logService";

export function ActivityExpandedRow({ log }: { log: ActivityLogType }) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <tr className="bg-indigo-50/20 border-b border-indigo-100/30">
            <td colSpan={6} className="px-5 py-0">
                <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "circOut" }}
                    className="overflow-hidden"
                >
                    <div className="py-5 pl-14 pr-8 flex items-start gap-5 border-l-4 border-l-indigo-500 my-3 rounded-r-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-y border-r border-slate-100">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 shadow-sm border border-indigo-100/50">
                            <Info size={20} />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Insight</span>
                                    <div className="h-px w-8 bg-slate-200" />
                                    {log.count && log.count > 1 && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-100">
                                            {log.count} occurrences this day
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleCopy(log.details || "", `${log.id}`); }}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 group/copy"
                                >
                                    <span className="text-[10px] font-bold uppercase hidden group-hover/copy:block transition-all">Copy Details</span>
                                    {copiedId === `${log.id}` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="text-[14px] leading-relaxed text-slate-600 font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                                {log.details ? <HighlightText text={log.details} /> : <span className="text-slate-400 italic">No detailed description available for this action.</span>}
                            </div>
                        </div>
                    </div>
                </m.div>
            </td>
        </tr>
    );
}
