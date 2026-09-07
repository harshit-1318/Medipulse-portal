import { LazyMotion, domAnimation } from "framer-motion";
import OrderTable from "@/components/orders-table/table";
import { useBacterialVaginosisOrdersData } from "../../hooks";

export default function BacterialVaginosisOrdersContent() {
    const { orders, page, setPage, total, loading, filters, setFilters, filtersEnabled, setFiltersEnabled } = useBacterialVaginosisOrdersData();

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat text-[16px] leading-normal pt-2 pb-6">
                <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">
                    Bacterial Vaginosis Orders
                </h1>
                <OrderTable
                    title="Bacterial Vaginosis Orders"
                    orders={orders}
                    loading={loading}
                    page={page}
                    setPage={setPage}
                    total={total}
                    filters={filters}
                    setFilters={setFilters}
                    pageType="overview"
                    hideFilters={false}
                    filtersEnabled={filtersEnabled}
                    setFiltersEnabled={setFiltersEnabled}
                />
            </div>
        </LazyMotion>
    );
}
