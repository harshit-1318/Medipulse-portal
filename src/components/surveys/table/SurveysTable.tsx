import type { Survey } from '@/types/survey';
import { Pagination } from '@/components/common/Pagination';
import { SurveyEmptyState } from './SurveyEmptyState';
import { useSurveysTableMutations } from './useSurveysTableMutations';
import { SurveyTableRow } from './SurveyTableRow';

interface SurveysTableProps {
    surveys: Survey[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    loading: boolean;
}

export default function SurveysTable({ surveys, total, page, limit, onPageChange, loading }: SurveysTableProps) {
    const { handleDelete, handleDuplicate } = useSurveysTableMutations();

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm font-montserrat w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white animate-in fade-in duration-500">
                <div className="inline-flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">
                            Surveys List
                        </h2>
                        <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {total}
                        </span>
                    </div>
                    <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full shadow-xs" />
                </div>
            </div>

            <div className={`overflow-x-auto transition-opacity duration-300 ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
                {surveys.length === 0 ? <SurveyEmptyState /> : (
                    <table className="w-full border-collapse min-w-200">
                        <thead className="bg-[#f8fafc] text-slate-800 border-b border-slate-100 font-montserrat">
                            <tr>
                                {['TITLE', 'STATUS', 'RESPONSES', 'VERSION', 'CREATED', 'ACTIONS'].map(h => (
                                    <th key={h} className={`px-6 py-4 text-left text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80 uppercase ${h === 'ACTIONS' ? 'text-right' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {surveys.map(survey => (
                                <SurveyTableRow
                                    key={survey._id}
                                    survey={survey}
                                    formatDate={formatDate}
                                    handleDelete={handleDelete}
                                    handleDuplicate={handleDuplicate}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {total > limit && (
                <div className="px-5 py-3 border-t border-slate-200 bg-white shadow-sm flex items-center justify-center">
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(total / limit)}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}
