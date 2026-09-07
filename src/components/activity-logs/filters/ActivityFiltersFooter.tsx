import { RefreshCcw } from "lucide-react";

interface Props {
    onClear: () => void;
    onCancel: () => void;
    onApply: () => void;
}

export const ActivityFiltersFooter = ({ onClear, onCancel, onApply }: Props) => {
    return (
        <div className="flex justify-between items-center px-8 py-6 border-t border-slate-100 bg-white relative">
            <button
                onClick={onClear}
                className="text-[13px] text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2 group"
            >
                <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-red-50 transition-colors">
                    <RefreshCcw size={14} strokeWidth={2.5} />
                </div>
                Clear Filters
            </button>
            <div className="flex items-center gap-4">
                <button
                    onClick={onCancel}
                    className="px-6 py-3 text-[14px] rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                    Cancel
                </button>
                <button
                    onClick={onApply}
                    className="px-10 py-3 text-[14px] rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 border border-indigo-500/50"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};
