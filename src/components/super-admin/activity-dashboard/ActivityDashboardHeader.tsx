import { Activity, RefreshCw } from 'lucide-react';
import { shortDate, PERIOD_OPTIONS } from './utils';
import type { ActivityDashboard } from '@/api/services/super-admin/superAdminService';

interface ActivityDashboardHeaderProps {
    days: number;
    setDays: (d: number) => void;
    loading: boolean;
    load: (d: number) => void;
    data: ActivityDashboard | null;
}

export function ActivityDashboardHeader({
    days,
    setDays,
    loading,
    load,
    data,
}: ActivityDashboardHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight flex items-center gap-2">
                    <Activity size={18} className="text-[#00A294]" />
                    Activity Log Dashboard
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                    </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Platform-wide — all sites combined
                    {data && (
                        <span className="ml-2 text-slate-400">
                            ({shortDate(data.period.from)} – {shortDate(data.period.to)})
                        </span>
                    )}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                    {PERIOD_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setDays(opt.value)}
                            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                                days === opt.value
                                    ? "bg-[#003B73] text-white shadow-xs"
                                    : "bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => void load(days)}
                    disabled={loading}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                    title="Refresh"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
        </div>
    );
}
