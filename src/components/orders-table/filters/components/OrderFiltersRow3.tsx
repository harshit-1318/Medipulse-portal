import { Layers, Package } from "lucide-react";
import CustomDropdown from "@/components/orders-table/ui";
import type { PageType } from "../../types";
import {
    getProductCategoryOptions,
} from "../utils/options";

interface OrderFiltersRow3Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
    localProductName: string;
    setLocalProductName: (v: string) => void;
    pageType: PageType;
}

export const OrderFiltersRow3 = ({
    filters,
    updateFilter,
    localProductName,
    setLocalProductName,
    pageType
}: OrderFiltersRow3Props) => {
    // Lock category to weight-loss on dashboard (overview page)
    const isCategoryLocked = pageType === 'overview';
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <CustomDropdown 
                label="Product Category" 
                icon={Layers} 
                value={isCategoryLocked ? (filters.category || filters.productCategory || "") : (filters.productCategory || filters.category || "")} 
                onChange={(v) => updateFilter("productCategory", v)} 
                options={getProductCategoryOptions()} 
                disabled={isCategoryLocked}
            />
            <div className="flex flex-col gap-1 text-left group">
                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors truncate" title="Product Name">
                    Product Name
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                        <Package size={15} strokeWidth={2.5} />
                    </div>
                    <input
                        className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs"
                        value={localProductName} 
                        onChange={(e) => setLocalProductName(e.target.value)} 
                        placeholder="Product name..."
                    />
                </div>
            </div>
        </div>
    );
};

