import type { LeadStatus, LeadStats } from '@/types/lead';

export const STATUS_TABS: { label: string; value: LeadStatus | '' }[] = [
    { label: 'All', value: '' },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Closed', value: 'closed' },
    { label: 'Lost', value: 'lost' },
];

interface StatsStripProps {
    stats?: LeadStats | Record<string, number>;
}

export function StatsStrip({ stats }: StatsStripProps) {
    if (!stats) return null;
    const statsRecord = stats as Record<string, number>;
    return (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {STATUS_TABS.filter(t => t.value).map(({ label, value }) => (
                <div key={value} className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 shadow-sm text-center">
                    <p className="text-lg font-bold text-slate-800">{statsRecord[value!] ?? 0}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
            ))}
        </div>
    );
}
