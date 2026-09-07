import { Info, Hash, User, Calendar } from "lucide-react";
import type { ApiResponse } from "@/components/order-details/types";
import { getOrderStatusStyle, detectOrderStatus, formatDateModern } from "@/components/order-details/utils";
import { LastPreviousOrderSection } from "./LastPreviousOrderSection";

interface ContactCardProps {
    orderInfo: ApiResponse["orderInfo"];
    customerInfo: ApiResponse["customerInfo"];
    formattedCreatedAt: string;
    lastPreviousOrder?: ApiResponse["lastPreviousOrder"];
}

export function ContactCard({ orderInfo, customerInfo, formattedCreatedAt, lastPreviousOrder }: ContactCardProps) {
    const currentStatus = detectOrderStatus(orderInfo.fulfillmentStatus, orderInfo.status);
    const statusStyle = getOrderStatusStyle(currentStatus);
    const isUnfulfilled = currentStatus === "UNFULFILLED";
    const dob = customerInfo.dob;

    return (
        <div className="relative group p-4 bg-white border border-slate-200 shadow-premium rounded-2xl flex flex-col transition-all duration-500 hover:shadow-2xl hover:border-slate-300 overflow-hidden h-full">
            <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-200 transition-transform group-hover:scale-105 duration-500 shrink-0">
                    <Info size={16} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-text-primary leading-none">Order Details</h3>
                </div>
                <div className={`inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-full border text-[11px] font-semibold uppercase tracking-wider shrink-0 shadow-sm ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} transition-all duration-300`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot} ${isUnfulfilled ? "animate-pulse" : ""}`} />
                    <span className="mt-px">{statusStyle.label}</span>
                </div>
            </div>

            <div className="space-y-1 flex-1 flex flex-col justify-start relative z-10 w-full">
                <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full min-h-9.5 group/row">
                    <div className="flex items-center gap-2 shrink-0">
                        <Hash size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                        <span className="text-text-secondary font-medium text-[13px] shrink-0">Order ID</span>
                    </div>
                    <span className="text-text-primary font-semibold text-[13px] tracking-tight text-right truncate flex-1 min-w-0 ml-4">
                        {orderInfo.orderId.toString().startsWith('#') ? orderInfo.orderId : `#${orderInfo.orderId}`}
                    </span>
                </div>

                <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full min-h-9.5 group/row">
                    <div className="flex items-center gap-2 shrink-0">
                        <Calendar size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                        <span className="text-text-secondary font-medium text-[13px] shrink-0">Order Date</span>
                    </div>
                    <span className="text-text-primary font-semibold text-[13px] tracking-tight text-right truncate flex-1 min-w-0 ml-4">{formattedCreatedAt}</span>
                </div>

                {dob && (
                    <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full min-h-9.5 group/row">
                        <div className="flex items-center gap-2 shrink-0">
                            <User size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                            <span className="text-text-secondary font-medium text-[13px] shrink-0">Date Of Birth</span>
                        </div>
                        <span className="text-text-primary font-semibold text-[13px] tracking-tight text-right truncate flex-1 min-w-0 ml-4">{formatDateModern(dob)}</span>
                    </div>
                )}

                {lastPreviousOrder && (
                    <LastPreviousOrderSection
                        lastPreviousOrder={lastPreviousOrder}
                        customerId={customerInfo.id}
                        totalOrders={customerInfo.totalOrders}
                    />
                )}
            </div>
        </div>
    );
}
