
import { ActiveFilterChips } from "@/components/orders-table/filters";
import { Filter } from "lucide-react";

interface Props {
    title?: string;
    total: number;
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    activeFilters: any[];
    removeFilter: (key: string) => void;
    clearFilters: () => void;
}

export const ActivityTableTitle = ({
    title,
    total,
    filtersEnabled,
    setFiltersEnabled,
    activeFilters,
    removeFilter,
    clearFilters
}: Props) => {
    if (!title) return null;

    return (
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-6">
                <div className="inline-flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">{title}</h2>
                        <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100 tabular-nums">
                            {total.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full shadow-xs" />
                </div>
                
                <div className="hidden md:block h-6 w-px bg-slate-100" />
                
                <ActiveFilterChips activeFilters={activeFilters} removeFilter={removeFilter} clearFilters={clearFilters} />
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setFiltersEnabled(!filtersEnabled)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-[14px] font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
                        filtersEnabled || (activeFilters && activeFilters.length > 0)
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs" 
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                    <Filter size={15} className={filtersEnabled || (activeFilters && activeFilters.length > 0) ? "text-indigo-600" : "text-slate-400"} strokeWidth={2.2} />
                    <span>Filters</span>
                </button>
            </div>

        </div>
    );
};
