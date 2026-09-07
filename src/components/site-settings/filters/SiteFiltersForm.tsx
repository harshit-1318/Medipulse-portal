import React from "react";
import { Search, LayoutGrid, Building2, Globe, Layers } from "lucide-react";
import type { SiteFiltersState } from "@/types/site";
import { StatusDropdown } from "./StatusDropdown";
import { SiteFilterDateInputs } from "./SiteFilterDateInputs";

interface Props {
    filters: SiteFiltersState;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const SiteFiltersForm: React.FC<Props> = ({ filters, onChange }) => {
    return (
        <div className="p-6 space-y-5 bg-white">
            <div className="relative flex items-center gap-4">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 flex items-center justify-center">
                    <LayoutGrid size={14} strokeWidth={2.5} />
                </div>
                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest whitespace-nowrap bg-white pr-2">Search & Filtering</h3>
                <div className="h-px flex-1 bg-slate-100 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5">
                        <Search size={13} className="text-slate-400" />
                        Global Search
                    </label>
                    <div className="relative group">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                        <input
                            name="search" value={filters.search} onChange={onChange}
                            placeholder="Search by name, key, or domain..."
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5">
                        <Building2 size={13} className="text-slate-400" />
                        Site Name
                    </label>
                    <div className="relative group">
                        <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                        <input
                            name="siteName" value={filters.siteName} onChange={onChange}
                            placeholder="Filter by Name"
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5">
                        <Globe size={13} className="text-slate-400" />
                        URL
                    </label>
                    <div className="relative group">
                        <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                        <input
                            name="url" value={filters.url} onChange={onChange}
                            placeholder="Filter by URL"
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5">
                        <Layers size={13} className="text-slate-400" />
                        Status
                    </label>
                    <StatusDropdown 
                        value={filters.status} 
                        onChange={(val) => {
                            onChange({
                                target: { name: "status", value: val }
                            } as React.ChangeEvent<HTMLSelectElement>);
                        }} 
                    />
                </div>

                <SiteFilterDateInputs filters={filters} onChange={onChange} />
            </div>
        </div>
    );
};

