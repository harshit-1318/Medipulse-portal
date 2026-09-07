import { Pagination } from '@/components/common/Pagination';
import type { SurveyResponse } from '@/types/survey';
import { SurveyResponseRow } from './SurveyResponseRow';

interface SurveyResponsesTableProps {
    items?: SurveyResponse[];
    total: number;
    page: number;
    loading: boolean;
    surveyId?: string;
    onPageChange: (p: number) => void;
    onSelectResponse: (resp: SurveyResponse) => void;
    onDeleteResponse: (sessionId: string) => void;
}

export function SurveyResponsesTable({
    items,
    total,
    page,
    loading,
    surveyId,
    onPageChange,
    onSelectResponse,
    onDeleteResponse,
}: SurveyResponsesTableProps) {
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-opacity ${loading ? 'opacity-60' : ''}`}>
            {(!items?.length) ? (
                <div className="py-20 text-center text-slate-400">
                    <p className="font-medium">No responses yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {['Customer', surveyId ? '' : 'Survey', 'Submitted', 'Source', 'Actions']
                                    .filter(Boolean)
                                    .map(h => (
                                        <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {items.map(resp => (
                                <SurveyResponseRow
                                    key={resp._id}
                                    resp={resp}
                                    surveyId={surveyId}
                                    onSelectResponse={onSelectResponse}
                                    onDeleteResponse={onDeleteResponse}
                                    formatDate={formatDate}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {total > 20 && (
                <div className="px-6 py-4 border-t border-slate-100">
                    <Pagination
                        currentPage={page}
                        totalItems={total}
                        itemsPerPage={20}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}

