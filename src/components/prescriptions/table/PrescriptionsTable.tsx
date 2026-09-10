import { useReactTable, getCoreRowModel, type SortingState } from "@tanstack/react-table";
import type { Prescription } from '@/types/prescription';
import PrescriptionsEmptyState from './PrescriptionsEmptyState';
import PrescriptionsTableHeader from './PrescriptionsTableHeader';
import PrescriptionRow from './PrescriptionRow';
import { Pagination } from '@/components/common/Pagination';
import ActiveFilterChips, { type ActiveFilterChipData } from '../filters/ActiveFilterChips';

interface PrescriptionsTableProps {
    prescriptions: Prescription[]; total: number; page: number; limit: number; onPageChange: (page: number) => void;
    filtersEnabled: boolean; setFiltersEnabled: (v: boolean) => void;
    sorting: SortingState; onSortingChange: (s: any) => void;
    activeFilterChips: ActiveFilterChipData[];
    onRemoveFilter: (key: string) => void;
    onClearFilters: () => void;
}

export default function PrescriptionsTable({
    prescriptions, total, page, limit, onPageChange,
    filtersEnabled, setFiltersEnabled,
    sorting, onSortingChange,
    activeFilterChips, onRemoveFilter
}: PrescriptionsTableProps) {
    const table = useReactTable({
        data: prescriptions,
        columns: [
            { accessorKey: "shopifyOrderId", id: "createdAt", header: "Order ID", enableSorting: true },
            { accessorKey: "customerId", header: "Customer ID", enableSorting: true },
            { accessorKey: "createdAt", id: "orderDate", header: "Order Date", enableSorting: true },
            { id: "regNo", header: "Reg. No.", enableSorting: false },
            { accessorKey: "pharmacistName", header: "Reviewed By", enableSorting: true },
            { accessorKey: "generatedAt", header: "Reviewed Date", enableSorting: true },
            { id: "actions", header: "ACTIONS", enableSorting: false }
        ],
        state: { sorting },
        onSortingChange,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm font-montserrat w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white animate-in fade-in duration-500">
                <div className="inline-flex flex-col shrink-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">
                            Prescriptions List
                        </h2>
                        <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {total}
                        </span>
                    </div>
                    <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full shadow-xs" />
                </div>

                <div className="flex items-center gap-3">
                    <ActiveFilterChips
                        chips={activeFilterChips}
                        onRemove={onRemoveFilter}
                    />

                    <button
                        onClick={() => setFiltersEnabled(!filtersEnabled)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 text-[14px] font-semibold rounded-lg transition-all shadow-sm cursor-pointer ${
                            filtersEnabled || activeFilterChips.length > 0
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-white text-slate-700 border border-slate-200 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={filtersEnabled || activeFilterChips.length > 0 ? "text-indigo-600" : "text-slate-500"}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        Filters
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[65vh] border-t border-slate-200">
                {prescriptions.length === 0 ? <PrescriptionsEmptyState /> : (
                    <table className="min-w-full text-[14px] text-slate-800 border-collapse relative">
                        <PrescriptionsTableHeader table={table} />
                        <tbody className="bg-white">
                            {prescriptions.map((p) => <PrescriptionRow key={p.id} prescription={p} />)}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-white">
                <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(total / limit))} onPageChange={onPageChange} />
            </div>
        </div>
    );
}
