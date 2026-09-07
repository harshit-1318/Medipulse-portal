import { X } from "lucide-react";
import type { ElementType } from "react";

export type ActiveFilter = {
    key: string;
    label: string;
    value: string | boolean;
    icon?: ElementType;
    isRemovable?: boolean;
};

interface Props {
    activeFilters: ActiveFilter[];
    removeFilter: (key: string) => void;
    clearFilters: () => void;
}

export function ActiveFilterChips({ activeFilters, removeFilter, clearFilters }: Props) {
    if (activeFilters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-end gap-2 overflow-hidden py-1">
            {activeFilters.map((filter) => {
                const Icon = filter.icon;
                const isRemovable = filter.isRemovable !== false;

                return (
                    <div 
                        key={filter.key} 
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white text-indigo-700 text-[13px] font-semibold rounded-full border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 animate-in fade-in zoom-in-95 cursor-default translate-y-0 hover:-translate-y-0.5"
                    >
                        {Icon && <Icon size={14} className="text-indigo-500 group-hover:scale-110 transition-transform" />}
                        <span className="flex items-center gap-1">
                            <span className="text-slate-500 font-medium">{filter.label}:</span>
                            <span className="text-indigo-700">{String(filter.value)}</span>
                        </span>
                        {isRemovable && (
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFilter(filter.key); }}
                                className="p-1 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors ml-1"
                                title={`Remove ${filter.label} filter`}
                            >
                                <X size={12} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                );
            })}
            <button
                onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                className="text-[13px] text-slate-500 font-bold hover:text-red-600 px-3 py-1.5 transition-all whitespace-nowrap uppercase tracking-wider flex items-center gap-1 hover:bg-red-50 rounded-lg ml-2"
            >
                Clear All
            </button>
        </div>
    );
}
