import { X, SlidersHorizontal } from "lucide-react";

interface Props {
    onClose: () => void;
}

export const ActivityFiltersHeader = ({ onClose }: Props) => {
    return (
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white relative">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                    <SlidersHorizontal size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Active Filters</h2>
            </div>
            <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="p-1.5 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-full transition-all duration-300 hover:bg-slate-50 cursor-pointer"
            >
                <X size={20} />
            </button>
        </div>
    );
};

