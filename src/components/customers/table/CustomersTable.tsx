import { useReactTable, getCoreRowModel, type SortingState } from "@tanstack/react-table";
import type { Customer } from '@/types/customer';
import CustomersEmptyState from './CustomersEmptyState';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerRow from './CustomerRow';
import { Pagination } from '@/components/common/Pagination';
import RecordCount from './RecordCount';
import TableActions from './TableActions';
import type { ActiveFilterChipData } from '../filters/ActiveFilterChips';

interface CustomersTableProps {
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    activeFiltersCount: number;
    sorting: SortingState;
    onSort: (columnId: string) => void;
    activeFilterChips: ActiveFilterChipData[];
    onRemoveFilter: (key: string) => void;
    onClearFilters: () => void;
}

export default function CustomersTable({
    customers, total, page, limit, onPageChange,
    filtersEnabled, setFiltersEnabled, activeFiltersCount,
    sorting, onSort,
    activeFilterChips, onRemoveFilter, onClearFilters
}: CustomersTableProps) {
    const table = useReactTable({
        data: customers,
        columns: [
            { accessorKey: "name", header: "Customer Info", enableSorting: true },
            { accessorKey: "customerId", header: "Customer ID", enableSorting: true },
            { accessorKey: "totalPens", header: "Total Pens", enableSorting: true },
            { accessorKey: "createdAt", header: "Created Date", enableSorting: true },
            { id: "actions", header: "Actions", enableSorting: false }
        ],
        state: { sorting },
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm font-montserrat w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white animate-in fade-in duration-500">
                <RecordCount total={total} />
                <TableActions
                    filtersEnabled={filtersEnabled}
                    setFiltersEnabled={setFiltersEnabled}
                    activeFiltersCount={activeFiltersCount}
                    activeFilterChips={activeFilterChips}
                    onRemoveFilter={onRemoveFilter}
                    onClearFilters={onClearFilters}
                />
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[65vh] border-t border-slate-200">
                {customers.length === 0 ? (
                    <CustomersEmptyState />
                ) : (
                    <table className="min-w-full text-[14px] text-slate-800 border-collapse relative">
                        <CustomersTableHeader table={table} onSort={onSort} />
                        <tbody className="bg-white">
                            {customers.map((c) => (
                                <CustomerRow key={c.customerId} customer={c} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-white">
                <Pagination
                    currentPage={page}
                    totalPages={Math.max(1, Math.ceil(total / limit))}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}
