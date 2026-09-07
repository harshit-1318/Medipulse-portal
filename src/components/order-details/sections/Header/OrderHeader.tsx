import type { ApiResponse } from "@/components/order-details/types";
import { getOrderStatusStyle, detectOrderStatus } from "@/components/order-details/utils";
import { OrderHeaderActions, CustomerMetaSummary } from "./components";

interface OrderHeaderProps {
    orderInfo: ApiResponse["orderInfo"];
    customerId?: number | string;
    formattedCreatedAt: string;
    isArchived: boolean;
    isClosed: boolean;
}

export function OrderHeader({ orderInfo, customerId, formattedCreatedAt }: OrderHeaderProps) {
    const currentStatus = detectOrderStatus(orderInfo.fulfillmentStatus, orderInfo.status);
    const statusStyle = getOrderStatusStyle(currentStatus);
    const isUnfulfilled = currentStatus === "UNFULFILLED";

    return (
        <div className="relative group transition-all duration-500">
            <div className="p-5 bg-white border border-slate-200 shadow-premium rounded-3xl relative transition-all duration-500 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
                    <CustomerMetaSummary 
                        isUrgent={!!orderInfo.isUrgent}
                        isParked={!!orderInfo.isParked}
                        orderId={orderInfo.orderId} 
                        formattedCreatedAt={formattedCreatedAt} 
                    />
                    
                    <OrderHeaderActions 
                        statusStyle={statusStyle} 
                        isUnfulfilled={isUnfulfilled} 
                        backPath="/dashboard"
                        shopifyOrderId={orderInfo.shopifyOrderId}
                        customerId={customerId}
                    />
                </div>
            </div>


        </div>
    );
}
