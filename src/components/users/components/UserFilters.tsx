import { Search, X, Filter } from 'lucide-react';
import type { Site } from '../types';
import { FilterChip } from './FilterChip';

interface UserFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    selectedSite: string;
    onSiteChange: (val: string) => void;
    sites: Site[];
    isSuperAdmin: boolean;
    activeFilterCount: number;
    onClearAll: () => void;
}

export default function UserFilters({
    search, onSearchChange, selectedSite, onSiteChange, sites, isSuperAdmin, activeFilterCount, onClearAll
}: UserFiltersProps) {
    return (
        <div className="flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-top-2 duration-700">
            <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 w-full max-w-2xl group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#00a294] focus:ring-2 focus:ring-[#00a294]/15 transition-all shadow-xs"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                            <X size={14} strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* Site Filter (Super Admin Only) */}
                {isSuperAdmin && (
                    <div className="w-full md:w-72 relative group">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none" size={14} />
                        <select
                            value={selectedSite}
                            onChange={(e) => onSiteChange(e.target.value)}
                            className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-700 outline-none appearance-none cursor-pointer focus:border-[#00a294] focus:ring-2 focus:ring-[#00a294]/15 transition-all shadow-xs truncate"
                            title={sites.find(s => s._id === selectedSite)?.site_name || selectedSite}
                        >
                            <option value="all">All Sites</option>
                            {sites.map(site => (
                                <option key={site._id} value={site._id}>{site.site_name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#00a294] transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                )}

                {/* Clear All Button */}
                {activeFilterCount > 0 && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-rose-600 transition-all text-xs font-semibold bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 rounded-xl shadow-xs whitespace-nowrap group"
                    >
                        <X size={14} strokeWidth={2.5} />
                        <span>Clear All</span>
                        <span className="flex items-center justify-center h-4.5 w-4.5 rounded-full bg-slate-100 group-hover:bg-rose-100 text-[10px] font-bold transition-colors">
                            {activeFilterCount}
                        </span>
                    </button>
                )}
            </div>

            {/* Active Filter Chips */}
            <div className="flex flex-wrap gap-2 px-1">
                {search && (
                    <FilterChip label={`Search: ${search}`} onRemove={() => onSearchChange('')} />
                )}
                {isSuperAdmin && selectedSite !== 'all' && (
                    <FilterChip
                        label={`Site: ${sites.find(s => s._id === selectedSite)?.site_name || selectedSite}`}
                        onRemove={() => onSiteChange('all')}
                    />
                )}
            </div>
        </div>
    );
}

