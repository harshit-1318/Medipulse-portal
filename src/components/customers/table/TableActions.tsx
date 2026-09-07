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
                className={`flex items-center gap-2 h-8.5 px-3.5 text-[12.5px] font-bold rounded-xl transition-all shadow-xs border cursor-pointer ${
                    filtersEnabled || activeFiltersCount > 0
                    ? "bg-teal-50 text-[#00a294] border-teal-200 shadow-sm" 
                    : "bg-white text-slate-600 border-slate-200 hover:text-[#00a294] hover:border-teal-300 hover:bg-slate-50"
                }`}
            >
                <Filter 
                    size={14} 
                    strokeWidth={2.5} 
                    className={filtersEnabled || activeFiltersCount > 0 ? "text-[#00a294]" : "text-slate-400"}
                />
                <span>Filters</span>
            </button>

        </div>
    );
}
