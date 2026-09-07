
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
                    className={`group flex items-center gap-2 h-8.5 px-3.5 text-[12.5px] font-bold rounded-xl transition-all shadow-xs border cursor-pointer ${
                        filtersEnabled || (activeFilters && activeFilters.length > 0)
                        ? "bg-teal-50 text-[#00a294] border-teal-200 shadow-sm" 
                        : "bg-white text-slate-600 border-slate-200 hover:text-[#00a294] hover:border-teal-300 hover:bg-slate-50"
                    }`}
                >
                    <Filter size={14} className={filtersEnabled || (activeFilters && activeFilters.length > 0) ? "text-[#00a294]" : "text-slate-400 group-hover:text-[#00a294]"} strokeWidth={2.5} />
                    <span>{filtersEnabled ? "Close Filters" : "Filters"}</span>
                </button>
            </div>
        </div>
    );
};
