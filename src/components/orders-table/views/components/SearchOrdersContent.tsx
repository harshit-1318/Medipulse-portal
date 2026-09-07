import { LazyMotion, domAnimation } from "framer-motion";
import OrderTable from "@/components/orders-table/table";
import { useSearchOrdersData } from "../../hooks";
import type { OrderType } from "@/api/services/orders";
import type { OrderFilters } from "../../types";

interface Props {
    initialData?: {
        orders: OrderType[];
        total: number;
        filters: OrderFilters;
        page: number;
    }
}

export default function SearchOrdersContent({ initialData }: Props) {
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
    } = useSearchOrdersData(initialData);

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat text-[16px] leading-normal pt-2 pb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
                        Search Results
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Showing results for your custom filter parameters
                    </p>
                </div>

                <OrderTable
                    title="Search Results"
                    orders={orders}
                    loading={loading}
                    page={page}
                    setPage={setPage}
                    total={total}
                    filters={filters}
                    setFilters={setFilters}
                    pageType="all"
                    hideFilters={false}
                    filtersEnabled={filtersEnabled}
                    setFiltersEnabled={setFiltersEnabled}
                />
            </div>
        </LazyMotion>
    );
}
