import { Filter, Plus } from 'lucide-react';
export function OrdersFilterBar() {
    return (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[1.25rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
                <Filter className="text-indigo-600" size={22} strokeWidth={2} />
                <span className="text-xl font-bold text-slate-800 tracking-tight">Filters</span>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                <Plus size={20} strokeWidth={3} />
            </button>
        </div>
    );
}
