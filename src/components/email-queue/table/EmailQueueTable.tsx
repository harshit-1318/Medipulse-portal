import type { EmailQueueOverview, EmailQueueJob } from '@/api/services/email-queue/emailQueueService';

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-sky-50 text-sky-700 border-sky-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed: 'bg-rose-50 text-rose-700 border-rose-200',
};

function formatDate(value: string | null | undefined): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.getTime() <= 0) return '-';
    return date.toLocaleString();
}

function StatusPill({ status }: { status: EmailQueueJob['status'] }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}>
            {status}
        </span>
    );
}

export function EmailQueueTable({ data }: { data: EmailQueueOverview | null }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Recent Queue Jobs</p>
                <p className="text-xs text-slate-500">Generated: {formatDate(data?.generatedAt ?? null)}</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Attempts</th>
                            <th className="px-4 py-3">Available At</th>
                            <th className="px-4 py-3">Processed At</th>
                            <th className="px-4 py-3">Error</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(data?.jobs ?? []).length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-slate-500" colSpan={7}>
                                    No queue jobs available.
                                </td>
                            </tr>
                        ) : (
                            (data?.jobs ?? []).map((job) => (
                                <tr key={job.id}>
                                    <td className="px-4 py-3"><StatusPill status={job.status} /></td>
                                    <td className="px-4 py-3 text-slate-700">#{job.orderId}</td>
                                    <td className="px-4 py-3 text-slate-700">{job.reminderType}</td>
                                    <td className="px-4 py-3 text-slate-700">{job.attempts}</td>
                                    <td className="px-4 py-3 text-slate-700">{formatDate(job.availableAt)}</td>
                                    <td className="px-4 py-3 text-slate-700">{formatDate(job.processedAt)}</td>
                                    <td className="max-w-[320px] truncate px-4 py-3 text-xs text-rose-700" title={job.lastError ?? ''}>
                                        {job.lastError || '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
