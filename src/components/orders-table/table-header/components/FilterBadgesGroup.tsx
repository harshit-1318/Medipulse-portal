import { useState } from "react";
import { ExportModal } from "../../actions";

interface Props {
    activeFilterBadges: { label: string; key: string; icon: any; isRemovable?: boolean }[];
    removeFilterBadge: (key: string) => void;
    showFilters: boolean;
    setShowFilters: (v: boolean) => void;
}

export function FilterBadgesGroup({ activeFilterBadges, removeFilterBadge, showFilters, setShowFilters }: Props) {
    const [showExportModal, setShowExportModal] = useState(false);

    return (
        <div className="flex items-center gap-3">
            {activeFilterBadges.length > 0 && (
                <div className="hidden md:flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-right-4 duration-500">
                    {activeFilterBadges.slice(0, 3).map((badge) => {
                        const Icon = badge.icon;
                        const isRemovable = badge.isRemovable !== false;

                        return (
                            <span 
                                key={badge.key} 
                                className="group flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-indigo-700 bg-white border border-indigo-100 rounded-full whitespace-nowrap shadow-sm ring-1 ring-indigo-200/20 hover:border-indigo-300 transition-all duration-300"
                            >
                                {Icon && <Icon size={12} className="text-indigo-500 group-hover:scale-110 transition-transform" />}
                                {badge.label}
                                {isRemovable && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFilterBadge(badge.key); }}
                                        className="hover:bg-red-50 hover:text-red-600 rounded-full p-0.5 transition-colors ml-0.5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                )}
                            </span>
                        );
                    })}
                    {activeFilterBadges.length > 3 && (
                        <span className="px-2.5 py-1 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-full shadow-sm">
                            +{activeFilterBadges.length - 3} more
                        </span>
                    )}
                </div>
            )}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-[14px] font-semibold rounded-lg transition-all shadow-sm ${showFilters ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-white text-slate-700 border border-slate-200 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50/50"}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={showFilters ? "text-indigo-600" : "text-slate-500"}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filters
            </button>

            <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 text-[14px] font-semibold rounded-lg transition-all shadow-sm bg-white text-slate-700 border border-slate-200 hover:text-green-700 hover:border-green-300 hover:bg-green-50/50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-green-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export
            </button>

            <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
        </div>
    );
}
