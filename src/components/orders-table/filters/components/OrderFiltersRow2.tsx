import { Layers, FileText, Calendar } from "lucide-react";
import CustomDropdown from "@/components/orders-table/ui";
import type { PageType } from "../../types";
import {
    getProductTypeOptions,
    getDocumentOptions
} from "../utils/options";

interface OrderFiltersRow2Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
    pageType: PageType;
}

export const OrderFiltersRow2 = ({
    filters,
    updateFilter,
    pageType
}: OrderFiltersRow2Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
             <CustomDropdown 
                label="Product Type" 
                icon={Layers} 
                value={filters.products} 
                onChange={(v) => updateFilter("products", v)} 
                options={getProductTypeOptions(pageType, filters?.category)} 
                disabled={["injectable", "oral"].includes(pageType)}
            />
            <CustomDropdown 
                label="Documents" 
                icon={FileText} 
                value={filters.documents} 
                onChange={(v) => updateFilter("documents", v)} 
                options={getDocumentOptions(pageType)} 
                disabled={["uploaded", "Not uploaded"].includes(pageType)}
            />
            <div className="flex flex-col gap-1 group">
                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-[#00a294]">Start Date</label>
                <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-[#00a294] transition-colors pointer-events-none">
                        <Calendar size={15} strokeWidth={2.5} />
                    </div>
                    <input 
                        type="date" 
                        className="w-full h-9.5 pl-9 pr-3 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs" 
                        value={filters.startDate} 
                        onChange={(e) => updateFilter("startDate", e.target.value)} 
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1 group">
                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-[#00a294]">End Date</label>
                <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-[#00a294] transition-colors pointer-events-none">
                        <Calendar size={15} strokeWidth={2.5} />
                    </div>
                    <input 
                        type="date" 
                        className="w-full h-9.5 pl-9 pr-3 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs" 
                        value={filters.endDate} 
                        onChange={(e) => updateFilter("endDate", e.target.value)} 
                    />
                </div>
            </div>
        </div>
    );
};
