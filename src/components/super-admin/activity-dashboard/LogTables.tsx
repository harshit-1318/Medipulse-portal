import { formatDate } from './utils';
import type { ActivityDashboard } from '@/api/services/super-admin/superAdminService';

export function SuccessfulLoginsTable({ logins }: { logins: ActivityDashboard["recentLogins"] }) {
    if ((logins ?? []).length === 0) {
        return <p className="text-sm text-slate-400 italic">No login events recorded yet.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-90">
                <thead>
                    <tr className="border-b border-slate-100 text-left text-slate-500 uppercase tracking-wide">
                        <th className="py-2 pr-3 font-semibold">Email</th>
                        <th className="py-2 pr-3 font-semibold">IP</th>
                        <th className="py-2 pr-3 font-semibold">Browser / OS</th>
                        <th className="py-2 font-semibold">When</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {(logins ?? []).map((l, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-2 pr-3 text-slate-700 max-w-35 truncate" title={l.email}>
                                {l.email || "—"}
                            </td>
                            <td className="py-2 pr-3 text-slate-500 font-mono">{l.ip ?? "—"}</td>
                            <td className="py-2 pr-3 text-slate-500">
                                {[l.browser, l.os].filter(Boolean).join(" / ") || "—"}
                            </td>
                            <td className="py-2 text-slate-400 whitespace-nowrap">
                                {formatDate(l.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function FailedLoginsTable({ logins }: { logins: ActivityDashboard["recentFailedLogins"] }) {
    if ((logins ?? []).length === 0) {
        return <p className="text-sm text-slate-400 italic">No failed logins recorded.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-75">
                <thead>
                    <tr className="border-b border-slate-100 text-left text-slate-500 uppercase tracking-wide">
                        <th className="py-2 pr-3 font-semibold">Email</th>
                        <th className="py-2 pr-3 font-semibold">IP</th>
                        <th className="py-2 font-semibold">When</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {(logins ?? []).map((l, i) => (
                        <tr key={i} className="hover:bg-red-50/30">
                            <td className="py-2 pr-3 text-slate-700 max-w-40 truncate" title={l.email}>
                                {l.email || "—"}
                            </td>
                            <td className="py-2 pr-3 text-red-500 font-mono">{l.ip ?? "—"}</td>
                            <td className="py-2 text-slate-400 whitespace-nowrap">
                                {formatDate(l.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
