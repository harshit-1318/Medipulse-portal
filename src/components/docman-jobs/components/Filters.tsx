import { Search, X, Filter } from 'lucide-react';

interface FiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusChange: (val: string) => void;
    activeFilterCount: number;
    onClearAll: () => void;
}

export default function Filters({
    search, onSearchChange, statusFilter, onStatusChange, activeFilterCount, onClearAll
}: FiltersProps) {
    const statuses = ['done', 'failed', 'processing', 'pending', 'cancelled'];

    return (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Patient name, ID or Email..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-11 pl-12 pr-12 bg-slate-50/70 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#00a294] focus:ring-4 focus:ring-[#00a294]/10 transition-all"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* Status Filter */}
                <div className="w-full md:w-64 relative group text-slate-400 focus-within:text-[#00a294] transition-colors">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" size={16} />
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full h-11 pl-12 pr-12 bg-slate-50/70 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#00a294] focus:ring-4 focus:ring-[#00a294]/10 transition-all capitalize"
                    >
                        <option value="all">All Statuses</option>
                        {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                {/* Clear All Button */}
                {activeFilterCount > 0 && (
                    <button
                        onClick={onClearAll}
                        className="h-11 flex items-center gap-2 px-6 text-slate-500 hover:text-rose-600 transition-all text-[11px] font-bold uppercase tracking-wider bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl shadow-xs whitespace-nowrap group animate-in slide-in-from-right-4 cursor-pointer"
                    >
                        <X size={14} strokeWidth={3} />
                        <span>Reset Filters</span>
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 group-hover:bg-rose-100 text-[10px] font-bold transition-colors">
                            {activeFilterCount}
                        </span>
                    </button>
                )}
            </div>

            {/* Active Chips */}
            {(search || statusFilter !== 'all') && (
                <div className="flex flex-wrap gap-2 mt-4 px-1">
                    {search && (
                        <FilterChip label={`Search: ${search}`} onRemove={() => onSearchChange('')} />
                    )}
                    {statusFilter !== 'all' && (
                        <FilterChip label={`Status: ${statusFilter}`} onRemove={() => onStatusChange('all')} />
                    )}
                </div>
            )}
        </div>
    );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 text-[#00a294] rounded-lg text-[10px] font-bold uppercase tracking-wider animate-in zoom-in duration-300">
            <span>{label}</span>
            <button onClick={onRemove} className="p-0.5 hover:bg-teal-100 rounded-md transition-all text-teal-600 cursor-pointer">
                <X size={12} strokeWidth={3} />
            </button>
        </div>
    );
}
