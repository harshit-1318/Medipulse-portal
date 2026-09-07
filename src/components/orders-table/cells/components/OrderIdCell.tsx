import type { OrderType } from "@/api/services/orders";

export function OrderIdCell({ order }: { order: OrderType }) {
    const isUrgent = order.isUrgent;
    const isParked = order.isParked;

    return (
        <a
            href={`/orders/view/${order.shopify_order_id}`}
            className="flex items-center justify-center gap-2 group cursor-pointer hover:no-underline"
        >
            <span className="text-[15px] font-extrabold font-mono text-[#003B73] tracking-wider drop-shadow-sm transition-colors group-hover:text-[#00B3CC]">
                {order.id}
            </span>
            {isUrgent && !isParked && (
                <div className="badge-pro-urgent transition-all duration-500 animate-in slide-in-from-left-2">
                    <div className="flex items-center gap-1.5 relative z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            Marked Urgent
                        </span>
                    </div>
                </div>
            )}
            {!isUrgent && isParked && (
                <div className="badge-pro-parked transition-all duration-500 animate-in slide-in-from-left-2">
                    <div className="flex items-center gap-1.5 relative z-10">
                        <svg className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            Parked Order
                        </span>
                    </div>
                </div>
            )}
            {isUrgent && isParked && (
                <div className="flex flex-col gap-1">
                    <div className="badge-pro-urgent transition-all duration-500 animate-in slide-in-from-left-2">
                        <div className="flex items-center gap-1.5 relative z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                Marked Urgent
                            </span>
                        </div>
                    </div>
                    <div className="badge-pro-parked transition-all duration-500 animate-in slide-in-from-left-2">
                        <div className="flex items-center gap-1.5 relative z-10">
                            <svg className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                Parked Order
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </a>
    );
}
