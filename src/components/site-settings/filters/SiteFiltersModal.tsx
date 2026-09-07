import { useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { SiteFiltersForm } from "./SiteFiltersForm";
import { SiteFiltersFooter } from "./SiteFiltersFooter";
import type { SiteFiltersState } from "@/types/site";

interface Props {
    isOpen: boolean;
    setOpen: (v: boolean) => void;
    filters: SiteFiltersState;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onClear: () => void;
}

export function SiteFiltersModal({ isOpen, setOpen, filters, onChange, onClear }: Props) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
            }}
        >
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-[0_30px_70px_rgba(79,70,229,0.18)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-slate-100 relative">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white relative">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                            <SlidersHorizontal size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Active Filters</h2>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-full transition-all duration-300 hover:bg-slate-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <SiteFiltersForm filters={filters} onChange={onChange} />
                </div>

                <SiteFiltersFooter onClear={onClear} onClose={() => setOpen(false)} />
            </div>
        </div>
    );
}
