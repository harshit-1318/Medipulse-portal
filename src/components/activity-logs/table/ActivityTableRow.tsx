import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ActivityLogType } from "@/api/services/log/logService";
import { getActionConfig } from "../utils";
import { AnimatePresence } from "framer-motion";
import { ActivityActionCell, ActivityUserCell } from "./ActivityTableCells";
import { ActivityExpandedRow } from "./ActivityExpandedRow";

type Props = {
    log: ActivityLogType;
};

export const ActivityTableRow = ({ log }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            }).format(date);
        } catch (e) { return dateString; }
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-GB', {
                hour: '2-digit', minute: '2-digit', hour12: true
            }).format(date).toLowerCase();
        } catch (e) { return ""; }
    };

    const config = getActionConfig(log.action);
    const dateFormatted = formatDate(log.createdAt);
    const timeFormatted = formatTime(log.createdAt);

    return (
        <React.Fragment>
            <tr
                className={`group transition-all duration-200 border-b border-slate-100 last:border-0 hover:bg-slate-50/80 cursor-pointer ${isExpanded ? 'bg-indigo-50/40' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <ActivityActionCell config={config} Icon={config.icon} count={log.count} />
                
                <ActivityUserCell userName={log.userName} userEmail={log.userEmail} />

                <td className="px-5 py-3.5 align-middle text-center">
                    <div className="flex flex-col items-center justify-center leading-tight">
                        {log.orderId ? (
                            <span className="text-[#003B73] font-bold text-[14px] leading-tight tabular-nums">
                                {log.orderId}
                            </span>
                        ) : (
                            <span className="text-slate-300 font-medium text-[12px] italic tracking-wide uppercase">System</span>
                        )}
                    </div>
                </td>

                <td className="px-5 py-3.5 align-middle text-center">
                    <div className="flex justify-center">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm transition-transform group-hover:scale-105">
                            {log.page || "Core"}
                        </span>
                    </div>
                </td>

                <td className="px-5 py-3.5 align-middle text-center">
                    <div className="flex flex-col items-center justify-center leading-tight">
                        <span className="text-[#003B73] font-bold text-[14px] tabular-nums">
                            {dateFormatted}
                        </span>
                        <span className="text-slate-400 font-medium text-[11px] mt-1 tabular-nums">
                            {timeFormatted}
                        </span>
                    </div>
                </td>

                <td className="px-5 py-3.5 align-middle text-center">
                    <div className="flex justify-center">
                        <button className={`p-2 rounded-xl transition-all duration-300 ${isExpanded ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 group-hover:bg-white group-hover:text-indigo-600 border border-transparent group-hover:border-slate-200'}`}>
                            {isExpanded ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
                        </button>
                    </div>
                </td>
            </tr>

            <AnimatePresence>
                {isExpanded && <ActivityExpandedRow log={log} />}
            </AnimatePresence>
        </React.Fragment>
    );
};
