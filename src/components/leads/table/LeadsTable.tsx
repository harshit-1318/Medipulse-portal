import { Pagination } from '@/components/common/Pagination';
import type { Lead } from '@/types/lead';
import { LeadTableRow } from './LeadTableRow';

interface LeadsTableProps {
    items?: Lead[];
    total: number;
    page: number;
    loading: boolean;
    onPageChange: (p: number) => void;
    onSelectLead: (id: string) => void;
}

const HEADERS = ['CUSTOMER', 'SURVEY', 'STATUS', 'ASSIGNED TO', 'CREATED', 'NOTES', 'ACTION'];

export function LeadsTable({
    items,
    total,
    page,
    loading,
    onPageChange,
    onSelectLead,
}: LeadsTableProps) {
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm font-montserrat w-full overflow-hidden flex flex-col transition-opacity ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white animate-in fade-in duration-500">
                <div className="inline-flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">
                            Leads List
                        </h2>
                        <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {total}
                        </span>
                    </div>
                    <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full shadow-xs" />
                </div>
            </div>

            {(!items?.length) ? (
                <div className="py-20 text-center text-slate-400">
                    <p className="font-medium">No leads found</p>
                    <p className="text-sm mt-1">Leads are created automatically when a survey is submitted</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-200">
                        <thead className="bg-[#f8fafc] text-slate-800 border-b border-slate-100 font-montserrat">
                            <tr>
                                {HEADERS.map(h => (
                                    <th key={h} className={`px-6 py-4 text-left text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80 uppercase ${h === 'ACTION' ? 'text-right' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {items.map(lead => (
                                <LeadTableRow
                                    key={lead._id}
                                    lead={lead}
                                    onSelectLead={onSelectLead}
                                    formatDate={formatDate}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {total > 20 && (
                <div className="px-5 py-3 border-t border-slate-200 bg-white shadow-sm flex items-center justify-center">
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(total / 20)}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}
