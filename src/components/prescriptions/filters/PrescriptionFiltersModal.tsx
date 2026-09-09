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
            <div className="bg-white w-full max-w-5xl rounded-4xl shadow-[0_20px_50px_rgba(79,70,229,0.15)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100/50 backdrop-blur-xl relative">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-linear-to-r from-white via-indigo-50/5 to-white relative overflow-hidden group">
                    <div className="flex items-center gap-3 relative">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 transition-all duration-300">
                            <SlidersHorizontal size={18} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-[18px] font-black text-slate-800 tracking-tight leading-none">Active Filters</h2>
                    </div>
                    <button
                        onClick={() => setFiltersEnabled(false)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 bg-white border border-slate-100 hover:border-red-100 shadow-xs active:scale-90"
                    >
                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
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

                <div className="flex justify-end items-center px-6 py-4 border-t border-slate-100 bg-linear-to-r from-white via-slate-50/30 to-white gap-3 relative">
                    <button
                        onClick={clearFilters}
                        className="px-6 py-2.5 text-[15px] rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95 bg-white shadow-sm"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={() => setFiltersEnabled(false)}
                        className="px-10 py-2.5 text-[15px] rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 border border-indigo-500/50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

