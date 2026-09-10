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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-montserrat flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="inline-flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">
                            Recent Queue Jobs
                        </h2>
                        <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {data?.jobs?.length ?? 0}
                        </span>
                    </div>
                    <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full shadow-xs" />
                </div>
                <p className="text-xs text-slate-500 font-medium">Generated: {formatDate(data?.generatedAt ?? null)}</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 font-montserrat sticky top-0 z-10 text-[14px] font-extrabold tracking-widest text-[#003B73]/80 uppercase text-left">
                        <tr>
                            <th className="py-4 px-5">Status</th>
                            <th className="py-4 px-5">Order</th>
                            <th className="py-4 px-5">Type</th>
                            <th className="py-4 px-5">Attempts</th>
                            <th className="py-4 px-5">Available At</th>
                            <th className="py-4 px-5">Processed At</th>
                            <th className="py-4 px-5">Error</th>
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
