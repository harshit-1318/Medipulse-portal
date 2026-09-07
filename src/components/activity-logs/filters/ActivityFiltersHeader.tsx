import { Search, X } from "lucide-react";

interface Props {
    onClose: () => void;
}

export const ActivityFiltersHeader = ({ onClose }: Props) => {
    return (
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden group">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50 shadow-sm transition-transform group-hover:scale-110 duration-500">
                    <Search size={22} strokeWidth={3} />
                </div>
                <div className="space-y-0.5">
                    <h2 className="text-[22px] font-black text-[#003B73] tracking-tighter">Filter Activity</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Find specific events in your system</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-300 active:scale-95 border border-transparent hover:border-slate-200"
            >
                <X size={24} strokeWidth={2.5} />
            </button>
        </div>
    );
};
