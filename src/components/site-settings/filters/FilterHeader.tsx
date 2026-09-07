import { Filter, SlidersHorizontal } from "lucide-react";

interface Props {
    filtersEnabled: boolean;
    setFiltersEnabled: (enabled: boolean) => void;
    activeFiltersCount: number;
    children?: React.ReactNode;
}

export const FilterHeader: React.FC<Props> = ({ setFiltersEnabled, activeFiltersCount, children }) => {
    return (
        <div className="relative z-40 mb-0">
            <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/80 shadow-xs rounded-xl transition-all duration-300">
                <div className="flex items-center gap-4 w-full overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2.5 min-w-fit">
                        <div className="p-1.5 bg-indigo-100/50 text-indigo-700 rounded-md">
                            <Filter size={16} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">Filters</h2>
                            {activeFiltersCount > 0 && (
                                <span className="flex items-center justify-center bg-indigo-100 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Inline Active Filters Section */}
                    {activeFiltersCount > 0 && (
                        <div className="flex items-center px-3 border-l border-slate-200 min-w-max">
                            {children}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setFiltersEnabled(true)}
                    className="flex items-center justify-center gap-2 px-4 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-bold text-[13px] rounded-lg transition-all duration-300 shadow-sm active:scale-95 group shrink-0"
                >
                    <SlidersHorizontal size={15} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-500" />
                    Configure Filters
                </button>
            </div>
        </div>
    );
};
