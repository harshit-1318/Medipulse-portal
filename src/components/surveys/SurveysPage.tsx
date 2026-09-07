
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { QueryProvider } from '@/components/common/QueryProvider';
import SurveysHeader from './components/SurveysHeader';
import SurveysTable from './table/SurveysTable';
import { useSurveysList } from './hooks/useSurveysList';

function StatsStrip({ stats }: { stats?: any }) {
    if (!stats) return null;
    const items = [
        { label: 'Total', value: stats.totalSurveys, color: 'text-teal-600' },
        { label: 'Published', value: stats.publishedSurveys, color: 'text-emerald-600' },
        { label: 'Drafts', value: stats.draftSurveys, color: 'text-slate-500' },
        { label: 'Total Responses', value: stats.completedSessions, color: 'text-blue-600' },
    ];
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map(item => (
                <div key={item.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                    <p className={`text-2xl font-bold mt-0.5 ${item.color}`}>{item.value ?? 0}</p>
                </div>
            ))}
        </div>
    );
}

function SurveysContent() {
    const { data, loading, stats, page, setPage } = useSurveysList();

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat text-[16px] leading-normal pt-2 pb-6">
                <SurveysHeader />
                <StatsStrip stats={stats} />
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <SurveysTable
                        surveys={data?.items || []}
                        total={data?.total || 0}
                        page={page}
                        limit={20}
                        onPageChange={setPage}
                        loading={loading}
                    />
                </m.div>
            </div>
        </LazyMotion>
    );
}

export default function SurveysPage() {
    return (
        <QueryProvider>
            <SurveysContent />
        </QueryProvider>
    );
}
