import { History } from 'lucide-react';
import type { ActivityDashboard } from '@/api/services/super-admin/superAdminService';

interface SourceBreakdownProps {
    bySource: ActivityDashboard["bySource"];
    legacyEvents: number;
    total: number;
}

export function SourceBreakdown({ bySource, legacyEvents, total }: SourceBreakdownProps) {
    const colors: Record<string, string> = {
        user: "bg-indigo-100 text-indigo-700 border-indigo-200",
        system: "bg-amber-100 text-amber-700 border-amber-200",
        store: "bg-emerald-100 text-emerald-700 border-emerald-200",
        shopify: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    const enrichedTotal = (bySource ?? []).reduce((s, r) => s + r.count, 0);

    if (bySource.length === 0 && legacyEvents === 0) {
        return <p className="text-sm text-slate-400 italic">No data yet.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                {(bySource ?? []).map((s) => {
                    const pct = enrichedTotal > 0 ? Math.round((s.count / enrichedTotal) * 100) : 0;
                    const cls = colors[s.source] ?? "bg-slate-100 text-slate-700 border-slate-200";
                    const displaySource = s.source === "shopify" ? "store" : s.source;
                    return (
                        <div key={s.source} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${cls}`}>
                            <span className="capitalize">{displaySource}</span>
                            <span className="font-bold">{s.count.toLocaleString()}</span>
                            <span className="font-normal opacity-70">({pct}%)</span>
                        </div>
                    );
                })}
            </div>
            {legacyEvents > 0 && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <History size={11} />
                    {legacyEvents.toLocaleString()} legacy events (pre-enrichment, no source tag) not shown above
                    {total > 0 && ` \u2014 ${Math.round((legacyEvents / total) * 100)}% of total`}.
                </p>
            )}
        </div>
    );
}
