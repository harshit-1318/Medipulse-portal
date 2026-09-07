import { User, Package, AlertCircle } from "lucide-react";
import type { PageType } from "../../types";
import { OrderFiltersRow1 } from "./OrderFiltersRow1";
import { OrderFiltersRow2 } from "./OrderFiltersRow2";
import { OrderFiltersRow3 } from "./OrderFiltersRow3";
import { UrgentToggle } from "./UrgentToggle";
import { ParkedToggle } from "./ParkedToggle";

interface Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    localCustomerName: string;
    setLocalCustomerName: (v: string) => void;
    localProductName: string;
    setLocalProductName: (v: string) => void;
    pageType: PageType;
}

export function OrderFiltersForm({
    filters, updateFilter, localOrderId, setLocalOrderId, 
    localCustomerName, setLocalCustomerName, localProductName, 
    setLocalProductName, pageType
}: Props) {
    return (
        <div className="px-6 py-2.5 overflow-y-auto space-y-2.5 custom-scrollbar bg-slate-50/30">
            <section className="space-y-1.5 text-left">
                <Header icon={<User size={13} strokeWidth={2.5} />} title="Order Basics" />
                <OrderFiltersRow1 
                    filters={filters} updateFilter={updateFilter} 
                    localOrderId={localOrderId} setLocalOrderId={setLocalOrderId} 
                    localCustomerName={localCustomerName} setLocalCustomerName={setLocalCustomerName} 
                    pageType={pageType} 
                />
            </section>

            <section className="space-y-1.5 text-left">
                <Header icon={<Package size={13} strokeWidth={2.5} />} title="Product Information" />
                <div className="grid grid-cols-1 space-y-1.5">
                    <OrderFiltersRow2 filters={filters} updateFilter={updateFilter} pageType={pageType} />
                    <OrderFiltersRow3 
                        filters={filters} updateFilter={updateFilter} 
                        localProductName={localProductName} setLocalProductName={setLocalProductName} 
                        pageType={pageType} 
                    />
                </div>
            </section>

            <section className="space-y-1.5 text-left">
                <Header icon={<AlertCircle size={13} strokeWidth={2.5} />} title="Special Handlers" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UrgentToggle 
                        isUrgent={filters.isUrgent} pageType={pageType} 
                        onToggle={(val) => updateFilter("isUrgent", val)} 
                    />
                    <ParkedToggle 
                        isParked={filters.isParked} pageType={pageType} 
                        onToggle={(val) => updateFilter("isParked", val)} 
                    />
                </div>
            </section>
        </div>
    );
}

const Header = ({ icon, title }: any) => (
    <div className="flex items-center gap-2">
        <div className="p-1 bg-[#00a294]/10 text-[#00a294] rounded-md border border-[#00a294]/20 shadow-xs">{icon}</div>
        <h3 className="text-[11px] font-black text-slate-700 tracking-[0.12em] uppercase">{title}</h3>
        <div className="h-px flex-1 bg-slate-200/70 ml-2 rounded-full" />
    </div>
);
