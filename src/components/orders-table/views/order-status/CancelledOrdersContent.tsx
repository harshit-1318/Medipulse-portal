import { LazyMotion, domAnimation } from "framer-motion";
import OrderTable from "@/components/orders-table/table";
import { useCancelledOrdersData } from "../../hooks";

export default function CancelledOrdersContent() {
    const {
        orders,
        page,
        setPage,
        total,
        loading,
        filters,
        setFilters,
        filtersEnabled,
        setFiltersEnabled
    } = useCancelledOrdersData();

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat text-[16px] leading-normal pt-2 pb-6">
                <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">
                    Cancelled Orders
                </h1>

                <OrderTable
                    title="Cancelled Orders List"
                    orders={orders}
                    loading={loading}
                    page={page}
                    setPage={setPage}
                    total={total}
                    filters={filters}
                    setFilters={setFilters}
                    pageType="cancelled"
                    hideFilters={false}
                    filtersEnabled={filtersEnabled}
                    setFiltersEnabled={setFiltersEnabled}
                />
            </div>
        </LazyMotion>
    );
}
