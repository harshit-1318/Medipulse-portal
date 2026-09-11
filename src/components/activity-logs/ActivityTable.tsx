import type { ActivityLogType } from "@/api/services/log/logService";
import { Pagination } from "@/components/common/Pagination";
import ActivityFilters from "./ActivityFilters";
import { useActivityFilters } from "./filters";
import {
    ActivityTableHeader,
    ActivityTableBody,
    ActivityTableTitle,
    useActivityTableReactTable,
} from "./table";

type Props = {
    logs: ActivityLogType[];
    loading: boolean;
    page: number;
    setPage: (page: number) => void;
    total: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
    onSort?: (column: string) => void;
    title?: string;
    filters: any;
    setFilters: (f: any) => void;
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    enableOrderSubgrouping?: boolean;
    siteOptions?: Array<{ label: string; value: string }>;
};

export default function ActivityTable(props: Props) {
    const {
        logs,
        loading,
        page,
        setPage,
        total,
        onSort,
        title,
        filters,
        setFilters,
        filtersEnabled,
        setFiltersEnabled,
        enableOrderSubgrouping = false,
        siteOptions = [],
    } = props;

    const pageSize = 20;
    const totalPages = loading && total === 0 ? Math.max(1, page) : Math.max(1, Math.ceil(total / pageSize));

    const { table, columns } = useActivityTableReactTable(logs, onSort);
    const { activeFilters, removeFilter, clearFilters, updateFilter, applyFilters, localSearch, setLocalSearch, localOrderId, setLocalOrderId } = useActivityFilters(filters, setFilters, setPage, siteOptions);

    return (
        <div className="bg-[#ffffff] rounded-2xl border border-slate-200 shadow-sm font-montserrat w-full overflow-hidden flex flex-col h-[calc(100vh-160px)]">
            <ActivityTableTitle 
                title={title}
                total={total}
                filtersEnabled={filtersEnabled}
                setFiltersEnabled={setFiltersEnabled}
                activeFilters={activeFilters}
                removeFilter={removeFilter}
                clearFilters={clearFilters}
            />

            <ActivityFilters
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                filtersEnabled={filtersEnabled}
                setFiltersEnabled={setFiltersEnabled}
                localSearch={localSearch}
                setLocalSearch={setLocalSearch}
                localOrderId={localOrderId}
                setLocalOrderId={setLocalOrderId}
                siteOptions={siteOptions}
                applyFilters={applyFilters}
            />

            <div className="flex-1 overflow-auto w-full relative border-t border-slate-100 bg-white">
                <table className="min-w-full text-sm text-slate-800 border-separate border-spacing-0">
                    <ActivityTableHeader table={table} />
                    <ActivityTableBody
                        table={table}
                        columnsCount={columns.length}
                        loading={loading}
                        enableOrderSubgrouping={enableOrderSubgrouping}
                    />
                </table>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-white shrink-0">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
}
