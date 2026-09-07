import { Hash, Calendar, Clock } from "lucide-react";
import type { ApiResponse } from "@/components/order-details/types";
import { getOrderStatusStyle, formatDate } from "@/components/order-details/utils";
import { LastOrderLookupButton } from "./LastOrderLookupButton";
import { LastOrderProductsList } from "./LastOrderProductsList";

interface LastPreviousOrderSectionProps {
    lastPreviousOrder: NonNullable<ApiResponse["lastPreviousOrder"]>;
    customerId?: string | number;
    totalOrders: number;
}

export function LastPreviousOrderSection({
    lastPreviousOrder,
    customerId,
    totalOrders,
}: LastPreviousOrderSectionProps) {
    const prevStatusStyle = getOrderStatusStyle(lastPreviousOrder.orderStatus);
    const relevantProducts = (lastPreviousOrder.products || []).filter(
        p => !p.name.toLowerCase().includes('shipment')
    );

    return (
        <div className="mt-2 pt-2 flex flex-col gap-0.5">
            <div className="flex items-center gap-2 mb-1.5">
                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-200 shrink-0">
                    <Clock size={16} strokeWidth={2.5} />
                </div>
                <span className="text-[13px] font-semibold text-text-primary">Last Order</span>
                <div className="flex-1" />
                <div className={`inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-full border text-[11px] font-semibold uppercase tracking-wider shrink-0 shadow-sm ${prevStatusStyle.bg} ${prevStatusStyle.text} ${prevStatusStyle.border}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${prevStatusStyle.dot}`} />
                    <span className="mt-px">{prevStatusStyle.label}</span>
                </div>
            </div>

            {lastPreviousOrder.orderId && (
                <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full min-h-9.5 group/row">
                    <div className="flex items-center gap-2 shrink-0">
                        <Hash size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                        <span className="text-text-secondary font-medium text-[13px] shrink-0">Order ID</span>
                    </div>
                    <LastOrderLookupButton orderId={lastPreviousOrder.orderId} />
                </div>
            )}

            <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full min-h-9.5 group/row">
                <div className="flex items-center gap-2 shrink-0">
                    <Calendar size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                    <span className="text-text-secondary font-medium text-[13px] shrink-0">Order Date</span>
                </div>
                <span className="text-text-primary font-semibold text-[13px] tracking-tight text-right truncate flex-1 min-w-0 ml-4">
                    {formatDate(lastPreviousOrder.createdAt) || 'N/A'}
                </span>
            </div>

            {lastPreviousOrder.orderStatus.toLowerCase().includes('fulfilled') && lastPreviousOrder.dispatchedAt && (
                <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full min-h-9.5 group/row">
                    <div className="flex items-center gap-2 shrink-0">
                        <Calendar size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                        <span className="text-text-secondary font-medium text-[13px] shrink-0">Fulfilled Date</span>
                    </div>
                    <span className="text-text-primary font-semibold text-[13px] tracking-tight text-right truncate flex-1 min-w-0 ml-4">
                        {formatDate(lastPreviousOrder.dispatchedAt) || 'N/A'}
                    </span>
                </div>
            )}

            {lastPreviousOrder.orderStatus.toLowerCase().includes('cancelled') && lastPreviousOrder.cancelledAt && (
                <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full min-h-9.5 group/row">
                    <div className="flex items-center gap-2 shrink-0">
                        <Calendar size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                        <span className="text-text-secondary font-medium text-[13px] shrink-0">Cancelled Date</span>
                    </div>
                    <span className="text-text-primary font-semibold text-[13px] tracking-tight text-right truncate flex-1 min-w-0 ml-4">
                        {formatDate(lastPreviousOrder.cancelledAt) || 'N/A'}
                    </span>
                </div>
            )}

            <LastOrderProductsList relevantProducts={relevantProducts} />

            <div className="pt-1.5">
                <a
                    href={`/orders/all?customerId=${customerId}&sortBy=createdAt&sort=desc`}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 text-xs font-bold text-gray-600 hover:bg-slate-100 transition-all border border-slate-200 group/pill shadow-sm"
                >
                    <span className="text-brand-teal text-sm">{totalOrders}</span>
                    <span className="uppercase tracking-widest opacity-80">Previous Orders</span>
                    <svg className="w-4 h-4 text-slate-400 group-hover/pill:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

