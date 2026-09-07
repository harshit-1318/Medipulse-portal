import { Search, Layers, RefreshCcw, Building2 } from "lucide-react";
import CustomDropdown from "@/components/orders-table/ui";
import { ACTION_OPTIONS, PAGE_OPTIONS } from "../utils/filterConstants";
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
        <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto bg-slate-50/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2.5">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">Search User / Email</label>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 text-[14px] font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all shadow-sm hover:border-slate-300"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="e.g. john@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2.5">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">Order / Subject ID</label>
                    <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 text-[14px] font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all shadow-sm hover:border-slate-300"
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

