import { Search, User, Layers, FileText } from "lucide-react";
import CustomDropdown from "@/components/orders-table/ui";
import type { PageType } from "../../types";
import {
    // getStatusOptions,
    getCustomerOrderOptions,
    getFulfillmentStatusOptions,
} from "../utils/options";

interface OrderFiltersRow1Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    localCustomerName: string;
    setLocalCustomerName: (v: string) => void;
    pageType: PageType;
}

export const OrderFiltersRow1 = ({
    filters,
    updateFilter,
    localOrderId,
    setLocalOrderId,
    localCustomerName,
    setLocalCustomerName,
    pageType
}: OrderFiltersRow1Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1 text-left group">
                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors">Order ID</label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                        <Search size={15} strokeWidth={2.5} />
                    </div>
                    <input
                        className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs"
                        value={localOrderId}
                        onChange={(e) => setLocalOrderId(e.target.value)}
                        placeholder="Order id..."
                    />
                </div>
            </div>
            <CustomDropdown
                label="Status"
                icon={Layers}
                value={filters.fulfillmentStatus}
                onChange={(v) => updateFilter("fulfillmentStatus", v)}
                options={getFulfillmentStatusOptions()}
            />
            <div className="flex flex-col gap-1 text-left group">
                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors truncate" title="Customer Name, Email, or ID">
                    Customer
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                        <User size={15} strokeWidth={2.5} />
                    </div>
                    <input
                        className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs"
                        value={localCustomerName}
                        onChange={(e) => setLocalCustomerName(e.target.value)}
                        placeholder="Name, Email, ID..."
                    />
                </div>
            </div>
            <CustomDropdown
                label="Customer Orders"
                icon={FileText}
                value={filters.repeatedOrders}
                onChange={(v) => updateFilter("repeatedOrders", v)}
                options={getCustomerOrderOptions(pageType)}
                disabled={["first", "repeat", "single"].includes(pageType)}
            />
        </div>
    );
};
