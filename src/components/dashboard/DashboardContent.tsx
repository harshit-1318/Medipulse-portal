import { LazyMotion, domAnimation } from "framer-motion";
import OrderTable from "../orders-table";
import { useDashboardData } from "./hooks/useDashboardData";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatCardsSection } from "./components/StatCardsSection";
import { CustomerDashboardView } from "./components/CustomerDashboardView";
import { DriverDashboardView } from "./components/DriverDashboardView";
import { QueryProvider } from "../common/QueryProvider";

function DashboardContentInternal() {
    const {
        role,
        stats,
        orders,
        page,
        setPage,
        total,
        loading,
        filters,
        setFilters
    } = useDashboardData();

    const isCustomer = role === 'customer' || role === 'user';
    const isDriver = role === 'driver';

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat text-[16px] leading-normal w-full mx-auto">
                <DashboardHeader />

                {isCustomer && <CustomerDashboardView />}

                {isDriver && <DriverDashboardView />}

                {!isCustomer && !isDriver && (
                    <>
                        <StatCardsSection stats={stats} />
                        <OrderTable
                            title="Order List"
                            subtitle="(Only Weight Loss Product Orders)"
                            orders={orders}
                            loading={loading}
                            page={page}
                            setPage={setPage}
                            total={total}
                            filters={filters}
                            setFilters={setFilters}
                            pageType="overview"
                            hideFilters={false}
                        />
                    </>
                )}
            </div>
        </LazyMotion>
    );
}

export default function DashboardContent() {
    return (
        <QueryProvider>
            <DashboardContentInternal />
        </QueryProvider>
    );
}
