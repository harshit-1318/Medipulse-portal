import { getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getSortedRowModel, type ExpandedState, type SortingState, useReactTable } from "@tanstack/react-table";
import { useState, useEffect, useRef } from "react";
import { Pagination } from "../../../common/Pagination";
import { useOrderColumns } from "./OrderColumns";
import { OrderTableContainer } from "./OrderTableContainer";
import OrderFilters from "../../filters";
import { FilterBadgesGroup } from "../../table-header";
import type { Props } from "../../types";
import { useOrderTableEffects } from "../../hooks";
import { useActiveFilters } from "../../hooks";
import { useScrollPreservation } from '@/hooks';
import { normalizeSortBy } from '@/utils/url';

const VALID_SORT_COLUMNS = new Set(["id", "date", "status", "customer", "repeatedOrders", "product"]);
const resolveSortId = (sortBy?: string) => {
    if (!sortBy) return "";
    const id = normalizeSortBy(sortBy);
    return VALID_SORT_COLUMNS.has(id) ? id : "";
};

export default function OrderTable(props: Props) {
    const { orders, title, subtitle, loading, page, setPage, total, filters, setFilters, pageType, hideFilters, filtersEnabled, setFiltersEnabled } = props;
    const containerRef = useScrollPreservation(`order-table-${pageType}`, loading);
    
    const [expanded, setExpanded] = useState<ExpandedState>({});

    // Initialize sorting from filters
    const [sorting, setSorting] = useState<SortingState>(() => {
        const id = resolveSortId(filters.sortBy);
        return id ? [{ id, desc: filters.sort === 'desc' }] : [];
    });
    
    const [localFiltersEnabled, setLocalFiltersEnabled] = useState(false);
    const showFilters = filtersEnabled ?? localFiltersEnabled;
    const setShowFilters = setFiltersEnabled ?? setLocalFiltersEnabled;
    const [pageSize] = useState(20);

    // Sync sorting state with filters only when external filters actually change
    const prevFilterSortRef = useRef({ sortBy: filters.sortBy, sort: filters.sort });
    useEffect(() => {
        if (
            prevFilterSortRef.current.sortBy !== filters.sortBy ||
            prevFilterSortRef.current.sort !== filters.sort
        ) {
            prevFilterSortRef.current = { sortBy: filters.sortBy, sort: filters.sort };
            const id = resolveSortId(filters.sortBy);
            setSorting(id ? [{ id, desc: filters.sort === 'desc' }] : []);
        }
    }, [filters.sortBy, filters.sort]);

    useOrderTableEffects({ loading, sorting, setPage, setFilters });
    const columns = useOrderColumns(pageType);
    const table = useReactTable({
        data: orders,
        columns,
        state: { sorting, expanded },
        onSortingChange: setSorting,
        onExpandedChange: setExpanded,
        enableMultiSort: false,
        manualFiltering: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        defaultColumn: { sortDescFirst: false },
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const { activeFilterBadges, removeFilterBadge } = useActiveFilters(filters, setFilters, setPage, pageType);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm font-montserrat w-full overflow-hidden">
            {title && (
                <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex flex-col shrink-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">{title}</h2>
                            {subtitle && <span className="text-[14px] text-slate-500 font-medium ml-1 flex-1 truncate max-w-100" title={subtitle}>{subtitle}</span>}
                            <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">{total}</span>
                        </div>
                        <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full" />
                    </div>
                    {!hideFilters && <FilterBadgesGroup activeFilterBadges={activeFilterBadges} removeFilterBadge={removeFilterBadge} showFilters={showFilters} setShowFilters={setShowFilters} />}
                </div>
            )}
            <OrderFilters filters={filters} setFilters={setFilters} setPage={setPage} pageType={pageType} filtersEnabled={showFilters} setFiltersEnabled={setShowFilters} hideFilters={hideFilters} hideHeader={true} />
            <OrderTableContainer containerRef={containerRef} table={table} columnsCount={columns.length} loading={loading} />
            <div className="px-5 py-3 border-t border-slate-200 bg-white">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
}
