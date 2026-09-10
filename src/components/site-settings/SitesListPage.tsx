
import { Plus } from "lucide-react";
import { useSitesPage } from "./hooks/useSitesPage";
import SitesFilters from "./filters/sites-filters";
import SitesTable from "./table/sites-table";
import { QueryProvider } from "@/components/common/QueryProvider";
import { getSiteColumns } from "./table/sites-columns";

function SitesListContent() {
    const {
        data,
        loading,
        page,
        setPage,
        sorting,
        setSorting,
        filtersEnabled,
        setFiltersEnabled,
        filters,
        setFilters,
        clearFilters
    } = useSitesPage();

    const columns = getSiteColumns();

    return (
        <div className="flex flex-col gap-4 font-montserrat animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">
                        Sites Directory
                    </h1>
                </div>

                <a
                    href="/sites/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A294] hover:bg-[#008F83] text-white font-medium text-[13px] rounded-lg shadow-sm transition-all active:scale-95 group shrink-0"
                >
                    <Plus size={16} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                    Create Site
                </a>
            </div>

            {/* Filters */}
            <SitesFilters
                filters={filters}
                setFilters={setFilters}
                setPage={setPage}
                filtersEnabled={filtersEnabled}
                setFiltersEnabled={setFiltersEnabled}
                clearFilters={clearFilters}
            />

            {/* Table */}
            <SitesTable
                data={data?.sites || []}
                loading={loading}
                page={page}
                setPage={setPage}
                total={data?.total || 0}
                search={filters.search}
                setSearch={(s) => setFilters(f => ({ ...f, search: s }))}
                sorting={sorting}
                setSorting={setSorting}
                columns={columns}
            />
        </div>
    );
}

export default function SitesListPage() {
    return (
        <QueryProvider>
            <SitesListContent />
        </QueryProvider>
    );
}
