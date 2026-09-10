import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { getEmailQueueOverview, type EmailQueueOverview } from '@/api/services/email-queue/emailQueueService';
import { EmailQueueTable } from './table';

const REFRESH_MS = 15000;

export default function EmailQueueMonitorPage() {
    const [data, setData] = useState<EmailQueueOverview | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setLastError(null);
        try {
            const overview = await getEmailQueueOverview(30);
            setData(overview);
        } catch (error) {
            setLastError(error instanceof Error ? error.message : 'Failed to load queue overview');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const timer = window.setInterval(() => {
            loadData();
        }, REFRESH_MS);

        return () => window.clearInterval(timer);
    }, [loadData]);

    const summaryCards = useMemo(() => {
        const summary = data?.summary;
        return [
            { label: 'Pending', value: summary?.pending ?? 0 },
            { label: 'Processing', value: summary?.processing ?? 0 },
            { label: 'Completed', value: summary?.completed ?? 0 },
            { label: 'Failed', value: summary?.failed ?? 0 },
            { label: 'Total', value: summary?.total ?? 0 },
            { label: 'Due Pending', value: summary?.duePending ?? 0 },
            { label: 'Retry Pending', value: summary?.retryPending ?? 0 },
        ];
    }, [data]);

    return (
        <div className="space-y-6 pt-4 pb-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">Email Queue Monitor</h1>
                </div>

                <button
                    type="button"
                    onClick={loadData}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {lastError ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    {lastError}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
                {summaryCards.map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
                    </div>
                ))}
            </div>

            <EmailQueueTable data={data} />
        </div>
    );
}
