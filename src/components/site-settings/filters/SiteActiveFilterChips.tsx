import { X, Calendar, Globe2, Layers, Building2 } from "lucide-react";
import type { SiteFiltersState } from "@/types/site";

interface Props {
    filters: SiteFiltersState;
    onRemove: (key: string) => void;
    onClear: () => void;
}

export const SiteActiveFilterChips: React.FC<Props> = ({ filters, onRemove, onClear }) => {
    const activeFilters: { key: string; label: string; value: string; icon: any }[] = [];

    if (filters.search) activeFilters.push({ key: 'search', label: 'Search', value: filters.search, icon: Building2 });
    if (filters.siteName) activeFilters.push({ key: 'siteName', label: 'Name', value: filters.siteName, icon: Building2 });
    if (filters.url) activeFilters.push({ key: 'url', label: 'Domain', value: filters.url, icon: Globe2 });
    if (filters.status && filters.status !== 'all') activeFilters.push({ key: 'status', label: 'Status', value: filters.status, icon: Layers });
    
    if (filters.startDate) {
        const dateVal = new Date(filters.startDate).toLocaleDateString();
        activeFilters.push({ key: 'startDate', label: 'Start', value: dateVal, icon: Calendar });
    }
    if (filters.endDate) {
        const dateVal = new Date(filters.endDate).toLocaleDateString();
        activeFilters.push({ key: 'endDate', label: 'End', value: dateVal, icon: Calendar });
    }

    if (activeFilters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {activeFilters.map((chip) => {
                const Icon = chip.icon;
                return (
                    <div
                        key={chip.key}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg group transition-all"
                    >
                        <Icon size={12} className="text-indigo-500" />
                        <span className="text-[12px] font-medium text-indigo-900">
                            <span className="opacity-60 mr-1">{chip.label}:</span>
                            {chip.value}
                        </span>
                        <button
                            onClick={() => onRemove(chip.key)}
                            className="p-0.5 ml-1 hover:bg-indigo-200 rounded-md text-indigo-400 hover:text-indigo-700 transition-colors"
                        >
                            <X size={12} strokeWidth={2.5} />
                        </button>
                    </div>
                );
            })}

            <button
                onClick={onClear}
                className="text-[12px] font-semibold text-red-600 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
            >
                Clear All
            </button>
        </div>
    );
};
