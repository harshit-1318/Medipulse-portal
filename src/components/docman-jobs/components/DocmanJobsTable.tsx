import type { DocmanJobType } from '../types';
import DocmanJobRow from './DocmanJobRow';
import { Pagination } from '@/components/common/Pagination';
import { DocmanJobsEmptyState } from './DocmanJobsEmptyState';

interface DocmanJobsTableProps {
    jobs: DocmanJobType[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    loading: boolean;
    onDelete: (id: string) => void;
}

export default function DocmanJobsTable({
    jobs, total, page, limit, onPageChange, loading, onDelete
}: DocmanJobsTableProps) {
    if (!loading && jobs.length === 0) {
        return <DocmanJobsEmptyState />;
    }

    const headers = [
        "ID", "PATIENT INFO", "COMMAND TYPE", "DOCUMENT", "COMPLETED AT", 
        "LAST ERROR", "RESPONSE", "IDEMPOTENCY KEY", "WORKER ID", 
        "CREATED AT", "UPDATED AT", "ACTION"
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm font-montserrat w-full overflow-hidden flex flex-col animate-in fade-in duration-500">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="inline-flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">
                            Job List
                        </h2>
                        <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {total}
                        </span>
                    </div>
                    <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full shadow-sm" />
                </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse min-w-300">
                    <thead className="bg-[#f8fafc] text-slate-800 border-b border-slate-100 font-montserrat sticky top-0 z-10">
                        <tr>
                            {headers.map((header) => (
                                <th 
                                    key={header} 
                                    className={`py-4 px-5 text-[14px] font-extrabold text-[#003B73]/80 uppercase tracking-widest whitespace-nowrap ${header === 'ACTION' ? 'text-right' : ''}`}
                                >
                                    <div className={`flex items-center gap-2 ${header === 'ACTION' ? 'justify-end' : ''}`}>
                                        {header}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {loading && jobs.length === 0 ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={12} className="py-7 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-4 bg-slate-50 rounded-full w-48"></div>
                                            <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                                            <div className="h-10 w-10 bg-slate-50 rounded-lg"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            jobs.map((job) => (
                                <DocmanJobRow 
                                    key={job._id} 
                                    job={job} 
                                    onDelete={onDelete} 
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!loading && total > limit && (
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

