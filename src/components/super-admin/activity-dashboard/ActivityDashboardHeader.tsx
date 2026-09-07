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
                    <Activity size={18} className="text-indigo-500" />
                    Activity Log Dashboard
                    <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                        Experimental
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
                <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                    {PERIOD_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setDays(opt.value)}
                            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                                days === opt.value
                                    ? "bg-indigo-600 text-white"
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
