import { Filter } from 'lucide-react';
import ActiveFilterChips, { type ActiveFilterChipData } from '../filters/ActiveFilterChips';

interface Props {
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    activeFiltersCount: number;
    activeFilterChips: ActiveFilterChipData[];
    onRemoveFilter: (key: string) => void;
    onClearFilters: () => void;
}

export default function TableActions({ 
    filtersEnabled, setFiltersEnabled, activeFiltersCount,
    activeFilterChips, onRemoveFilter
}: Props) {
    return (
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-2 duration-500">
            {/* Active Filter Chips Integrated into Header */}
            <div className="hidden md:block">
                <ActiveFilterChips 
                    chips={activeFilterChips} 
                    onRemove={onRemoveFilter} 
                />
            </div>

            <button 
                onClick={() => setFiltersEnabled(!filtersEnabled)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-[14px] font-semibold rounded-lg transition-all shadow-sm cursor-pointer ${
                    filtersEnabled || activeFiltersCount > 0
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200" 
                        : "bg-white text-slate-700 border border-slate-200 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={filtersEnabled || activeFiltersCount > 0 ? "text-indigo-600" : "text-slate-500"}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filters
            </button>

        </div>
    );
}
