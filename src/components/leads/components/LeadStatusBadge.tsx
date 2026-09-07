import type { LeadStatus } from '@/types/lead';

const CONFIG: Record<LeadStatus, { label: string; classes: string; dot: string }> = {
    new:       { label: 'New',       classes: 'bg-blue-50 text-blue-700 border-blue-200',   dot: 'bg-blue-500' },
    contacted: { label: 'Contacted', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    qualified: { label: 'Qualified', classes: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
    closed:    { label: 'Closed',    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    lost:      { label: 'Lost',      classes: 'bg-red-50 text-red-700 border-red-200',     dot: 'bg-red-400' },
};

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
    const cfg = CONFIG[status] ?? CONFIG.new;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}
