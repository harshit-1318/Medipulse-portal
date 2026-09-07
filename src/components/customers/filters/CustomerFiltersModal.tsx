import { X, SlidersHorizontal } from "lucide-react";
import { CustomerFiltersForm } from "./CustomerFiltersForm";

interface Props {
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    clearFilters: () => void;
    localSearch: string;
    setLocalSearch: (v: string) => void;
    localTotalPens: string;
    setLocalTotalPens: (v: string) => void;
    localStartDate: string;
    setLocalStartDate: (v: string) => void;
    handleApply: () => void;
}

export function CustomerFiltersModal({
    filtersEnabled,
    setFiltersEnabled,
    clearFilters,
    localSearch,
    setLocalSearch,
    localTotalPens,
    setLocalTotalPens,
    localStartDate,
    setLocalStartDate,
    handleApply
}: Props) {
    if (!filtersEnabled) return null;

    return (
        <div className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-4xl shadow-[0_20px_50px_rgba(79,70,229,0.15)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100/50 backdrop-blur-xl relative">
                <div className="absolute inset-0 bg-linear-to-tr from-indigo-50/10 via-transparent to-slate-50/10 pointer-events-none" />

                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-linear-to-r from-white via-indigo-50/5 to-white relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-400/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                    <div className="flex items-center gap-3 relative">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] transition-all duration-300">
                            <SlidersHorizontal size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-800 tracking-tight leading-none">Active Filters</h2>
                        </div>
                    </div>
                    <button
                        onClick={() => setFiltersEnabled(false)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group bg-white border border-slate-100 hover:border-red-100 shadow-xs active:scale-90"
                    >
                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfdfe]/50">
                    <CustomerFiltersForm
                        localSearch={localSearch}
                        setLocalSearch={setLocalSearch}
                        localTotalPens={localTotalPens}
                        setLocalTotalPens={setLocalTotalPens}
                        localStartDate={localStartDate}
                        setLocalStartDate={setLocalStartDate}
                    />
                </div>

                <div className="flex justify-end items-center px-6 py-4 border-t border-slate-100 bg-linear-to-r from-white via-slate-50/30 to-white gap-3 relative">
                    <button
                        onClick={clearFilters}
                        className="px-6 py-2.5 text-[15px] rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95 bg-white shadow-sm"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-10 py-2.5 text-[15px] rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 border border-indigo-500/50"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
