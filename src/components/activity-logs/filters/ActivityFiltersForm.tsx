import { Search, Layers, RefreshCcw, Building2, LayoutGrid } from "lucide-react";
import CustomDropdown from "@/components/orders-table/ui";
import { ACTION_OPTIONS, PAGE_OPTIONS } from "../utils";
import { ActivityDateInputs } from "./ActivityDateInputs";

interface Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
    localSearch: string;
    setLocalSearch: (v: string) => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    siteOptions?: Array<{ label: string; value: string }>;
}

export const ActivityFiltersForm = ({
    filters,
    updateFilter,
    localSearch,
    setLocalSearch,
    localOrderId,
    setLocalOrderId,
    siteOptions = []
}: Props) => {
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
                        Search User / Email
                    </label>
                    <div className="relative group">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                        <input
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="e.g. john@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5">
                        <Layers size={13} className="text-slate-400" />
                        Order / Subject ID
                    </label>
                    <div className="relative group">
                        <Layers size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                        <input
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                            value={localOrderId}
                            onChange={(e) => setLocalOrderId(e.target.value)}
                            placeholder="e.g. 1277551893"
                        />
                    </div>
                </div>

                <CustomDropdown
                    label="Action Type"
                    icon={RefreshCcw}
                    value={filters.action}
                    onChange={(v) => updateFilter("action", v)}
                    options={ACTION_OPTIONS}
                />

                <CustomDropdown
                    label="Page Scope"
                    icon={Layers}
                    value={filters.view}
                    onChange={(v) => updateFilter("view", v)}
                    options={PAGE_OPTIONS}
                />

                {siteOptions.length > 0 && (
                    <CustomDropdown
                        label="Site"
                        icon={Building2}
                        value={filters.siteId || ""}
                        onChange={(v) => updateFilter("siteId", v)}
                        options={siteOptions}
                    />
                )}

                <ActivityDateInputs
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    updateFilter={updateFilter}
                />
            </div>
        </div>
    );
};


