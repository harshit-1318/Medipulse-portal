import { m } from "framer-motion";
import { Filter } from "lucide-react";

interface Props {
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    hideFilters?: boolean;
    children?: React.ReactNode;
}

export function FilterHeader({ filtersEnabled, setFiltersEnabled, hideFilters, children }: Props) {
    if (hideFilters) return null;

    return (
        <div className="flex justify-between items-center px-4 py-2 bg-white/90 border border-slate-200 shadow-sm rounded-xl transition-all duration-200">
            <h2
                className="text-[17px] font-semibold text-slate-800 flex items-center gap-2 cursor-pointer hover:text-indigo-700 transition-colors"
                onClick={() => setFiltersEnabled(!filtersEnabled)}
            >
                <m.div whileHover={{ rotate: 10, scale: 1.05 }} transition={{ duration: 0.15 }} className="text-indigo-700">
                    <Filter size={18} />
                </m.div>
                Filters
            </h2>

            {/* Inline Active Filters Section */}
            <div className="flex-1 flex justify-end items-center px-2">
                {children}
            </div>
        </div>
    );
}
