import { X, SlidersHorizontal } from "lucide-react";

interface OrderFiltersHeaderProps {
    onClose: () => void;
}

export function OrderFiltersHeader({ onClose }: OrderFiltersHeaderProps) {
    return (
        <div className="flex justify-between items-center px-6 md:px-8 py-3 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#00a294]/10 text-[#00a294] rounded-lg border border-[#00a294]/20 shadow-xs">
                    <SlidersHorizontal size={16} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-tight">Active Filters</h2>
                    <p className="text-[11px] font-medium text-slate-400">Refine and filter table orders</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
                aria-label="Close modal"
            >
                <X size={18} strokeWidth={2} />
            </button>
        </div>
    );
}
