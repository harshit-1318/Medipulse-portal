import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { QueryProvider } from '@/components/common/QueryProvider';
import { deleteSurveyResponse, exportSurveyResponses } from '@/api/services/survey/surveyResponsesService';
import { useResponsesList } from './hooks/useResponsesList';
import SurveyResponseDetail from './SurveyResponseDetail';
import { SurveyResponsesTable } from './table/SurveyResponsesTable';
import type { SurveyResponse } from '@/types/survey';

interface SurveyResponsesPageProps {
    surveyId?: string;
    surveyTitle?: string;
}

function ResponsesContent({ surveyId, surveyTitle }: SurveyResponsesPageProps) {
    const { data, loading, page, setPage } = useResponsesList({ surveyId });
    const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: ({ sessionId }: { sessionId: string }) => deleteSurveyResponse(surveyId!, sessionId),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['survey-responses'] }); toast.success('Response deleted'); },
        onError: () => toast.error('Could not delete response'),
    });

    const handleExport = async () => {
        if (!surveyId) return;
        try {
            const blob = await exportSurveyResponses(surveyId, { format: 'csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `survey-responses-${surveyId}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error('Export failed');
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat pt-2 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{surveyTitle ? `${surveyTitle} — Responses` : 'All Responses'}</h1>
                        <p className="text-sm text-slate-500 mt-0.5">{data?.total ?? 0} submission{(data?.total ?? 0) !== 1 ? 's' : ''}</p>
                    </div>
                    {surveyId && (
                        <button onClick={handleExport} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer">
                            <Download size={15} />
                            Export CSV
                        </button>
                    )}
                </div>

                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <SurveyResponsesTable
                        items={data?.items}
                        total={data?.total ?? 0}
                        page={page}
                        loading={loading}
                        surveyId={surveyId}
                        onPageChange={setPage}
                        onSelectResponse={setSelectedResponse}
                        onDeleteResponse={(sessionId) => deleteMutation.mutate({ sessionId })}
                    />
                </m.div>
            </div>

            <SurveyResponseDetail response={selectedResponse} onClose={() => setSelectedResponse(null)} />
        </LazyMotion>
    );
}

export default function SurveyResponsesPage(props: SurveyResponsesPageProps) {
    return (
        <QueryProvider>
            <ResponsesContent {...props} />
        </QueryProvider>
    );
}
