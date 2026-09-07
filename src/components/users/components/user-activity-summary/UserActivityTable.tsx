import type { UserActivitySummaryDay } from "@/api/services/activity-log/types";
import { formatDate, labelFor } from './utils';

interface UserActivityTableProps {
    summary: UserActivitySummaryDay[];
    combined: Record<string, number>;
    totalActions: number;
}

export function UserActivityTable({ summary, combined, totalActions }: UserActivityTableProps) {
    const actionTotals = Object.entries(combined).sort((a, b) => b[1] - a[1]);

    return (
        <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Action</th>
                        {summary.length > 1 &&
                            summary.map((d) => (
                                <th key={d.date} className="text-center px-3 py-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">
                                    {formatDate(d.date)}
                                </th>
                            ))}
                        <th className="text-center px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {actionTotals.map(([action, total]) => (
                        <tr key={action} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-2 text-slate-700 font-medium">{labelFor(action)}</td>
                            {summary.length > 1 &&
                                summary.map((d) => (
                                    <td key={d.date} className="text-center px-3 py-2 text-slate-600">
                                        {d.actions?.[action] ?? 0}
                                    </td>
                                ))}
                            <td className="text-center px-4 py-2 font-bold text-slate-800">{total}</td>
                        </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                        <td className="px-4 py-2 text-slate-700">Total</td>
                        {summary.length > 1 &&
                            summary.map((d) => (
                                <td key={d.date} className="text-center px-3 py-2 text-slate-800">
                                    {d.total}
                                </td>
                            ))}
                        <td className="text-center px-4 py-2 text-slate-800">{totalActions}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export function DailyTotalsCards({ summary }: { summary: UserActivitySummaryDay[] }) {
    if (summary.length <= 1) return null;

    return (
        <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Daily Totals</p>
            <div className="flex flex-wrap gap-2">
                {summary.map((d) => (
                    <div key={d.date} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center min-w-22.5">
                        <p className="text-[10px] text-slate-500 font-medium">{formatDate(d.date)}</p>
                        <p className="text-lg font-bold text-slate-800">{d.total}</p>
                        <p className="text-[10px] text-slate-400">actions</p>
                        <p className="text-[10px] text-slate-500 mt-1">~{(d.activeHoursApprox ?? 0).toFixed(2)}h active</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
