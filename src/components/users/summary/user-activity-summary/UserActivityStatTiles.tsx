import { BarChart2, Eye, RefreshCw, Mail, ShieldAlert, FileText, Clock3 } from "lucide-react";
import { sumGroup, GROUPS } from './utils';

interface UserActivityStatTilesProps {
    totalActiveHoursApprox: string;
    totalActions: number;
    uniqueOrdersViewed: number;
    combined: Record<string, number>;
}

export function UserActivityStatTiles({
    totalActiveHoursApprox,
    totalActions,
    uniqueOrdersViewed,
    combined,
}: UserActivityStatTilesProps) {
    const stats = [
        { label: "Active Hours (Approx)", value: totalActiveHoursApprox, icon: <Clock3 size={16} className="text-teal-500" />, color: "bg-teal-50 border-teal-100" },
        { label: "Total Actions", value: totalActions, icon: <BarChart2 size={16} className="text-[#00a294]" />, color: "bg-teal-50/80 border-teal-100" },
        { label: "Orders Viewed", value: uniqueOrdersViewed, icon: <Eye size={16} className="text-blue-500" />, color: "bg-blue-50 border-blue-100" },
        { label: "Status Changes", value: sumGroup(combined, GROUPS.statusChanged), icon: <RefreshCw size={16} className="text-emerald-500" />, color: "bg-emerald-50 border-emerald-100" },
        { label: "Reviews", value: sumGroup(combined, GROUPS.reviews), icon: <ShieldAlert size={16} className="text-violet-500" />, color: "bg-violet-50 border-violet-100" },
        { label: "Emails Sent", value: sumGroup(combined, GROUPS.emails), icon: <Mail size={16} className="text-amber-500" />, color: "bg-amber-50 border-amber-100" },
        { label: "PDFs Generated", value: sumGroup(combined, GROUPS.pdf), icon: <FileText size={16} className="text-rose-500" />, color: "bg-rose-50 border-rose-100" },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {stats.map((s) => (
                <div key={s.label} className={`rounded-xl border p-3 ${s.color}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                        {s.icon}
                        <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wide">{s.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                </div>
            ))}
        </div>
    );
}
