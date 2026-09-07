import { Eye, ExternalLink } from "lucide-react";
import { UrgentActionButton } from "@/components/orders-table/ui";
import type { OrderType } from "@/api/services/orders";

export function ActionsCell({ order }: { order: OrderType }) {
    const rawId = (order.shopify_order_id && order.shopify_order_id !== "--" && order.shopify_order_id !== "undefined")
        ? order.shopify_order_id
        : (order.id && order.id !== "--" && order.id !== "undefined")
            ? order.id
            : (order as any)._id || (order as any).order_id || "";
    const orderId = String(rawId || "").replace(/^#/, "");

    return (
        <div className="flex flex-col gap-2 items-center">
            {/* VIEW BUTTON GROUP (60/40 split) - Unified Layout */}
            <div className="flex items-stretch w-27.5 h-8.5 rounded-lg overflow-hidden
                bg-white/60 backdrop-blur-md
                border border-cyan-200/60
                shadow-[0_2px_10px_-2px_rgba(6,182,212,0.15)]
                hover:-translate-y-[1.5px] hover:border-cyan-300/80
                hover:shadow-[0_4px_12px_-2px_rgba(6,182,212,0.25)]
                active:translate-y-0 active:shadow-sm
                transition-all duration-300 group/view">

                {/* Main View Button (60%) */}
                <a
                    href={`/orders/view/${orderId}`}
                    className="flex-[0.6] flex items-center justify-center gap-1.5 
                    text-cyan-700 text-[11.5px] font-bold font-montserrat tracking-wide
                    border-r border-cyan-200/60 hover:bg-cyan-50/50
                    transition-colors duration-200 relative overflow-hidden cursor-pointer"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 -translate-x-full group-hover/view:translate-x-full transition-transform duration-700 ease-in-out" />
                    <Eye size={14} className="opacity-85 stroke-[2.5]" />
                    <span>View</span>
                </a>

                {/* New Tab Button (40%) */}
                <a
                    href={`/orders/view/${orderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-[0.4] flex items-center justify-center
                    text-cyan-600 hover:bg-cyan-50/50
                    transition-colors duration-200 cursor-pointer"
                    title="Open in new tab"
                >
                    <ExternalLink size={14} className="opacity-85 stroke-[2.5]" />
                </a>
            </div>

            {/* URGENT */}
            <UrgentActionButton 
                orderId={orderId} 
                orderNumber={order.id} 
                isUrgent={Boolean(order.isUrgent)} 
                isDisabled={order.status?.toLowerCase() === "cancelled"}
            />
        </div>
    );
}
