import { useEffect } from 'react';
import { X, SlidersHorizontal } from "lucide-react";
import { PrescriptionFiltersForm } from "./PrescriptionFiltersForm";

interface Props {
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    filters: any;
    updateFilter: (key: string, value: any) => void;
    clearFilters: () => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    localPrescriber: string;
    setLocalPrescriber: (v: string) => void;
    localCustomerId: string;
    setLocalCustomerId: (v: string) => void;
}

export function PrescriptionFiltersModal({
    filtersEnabled,
    setFiltersEnabled,
    filters,
    updateFilter,
    clearFilters,
    localOrderId,
    setLocalOrderId,
    localPrescriber,
    setLocalPrescriber,
    localCustomerId,
    setLocalCustomerId,
}: Props) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setFiltersEnabled(false); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setFiltersEnabled]);

    if (!filtersEnabled) return null;

    return (
        <div
            className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in transition-[left] duration-300 ease-in-out"
            style={{ left: "var(--sidebar-width, 17.5rem)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setFiltersEnabled(false); }}
        >
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200 border border-slate-200 relative">
                <div className="flex justify-between items-center px-6 md:px-8 py-3 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#00a294]/10 text-[#00a294] rounded-lg border border-[#00a294]/20 shadow-xs">
                            <SlidersHorizontal size={16} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-tight">Active Filters</h2>
                            <p className="text-[11px] font-medium text-slate-400">Refine and filter table prescriptions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setFiltersEnabled(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    <PrescriptionFiltersForm
                        filters={filters}
                        updateFilter={updateFilter}
                        localOrderId={localOrderId}
                        setLocalOrderId={setLocalOrderId}
                        localPrescriber={localPrescriber}
                        setLocalPrescriber={setLocalPrescriber}
                        localCustomerId={localCustomerId}
                        setLocalCustomerId={setLocalCustomerId}
                    />
                </div>

                <div className="flex justify-end items-center gap-3 px-6 md:px-8 py-3 border-t border-slate-100 bg-white">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-[13.5px] rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={() => setFiltersEnabled(false)}
                        className="px-7 py-2 text-[13.5px] rounded-xl bg-[#00a294] text-white font-bold hover:bg-[#008f82] shadow-md shadow-[#00a294]/25 hover:shadow-lg hover:shadow-[#00a294]/35 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}

