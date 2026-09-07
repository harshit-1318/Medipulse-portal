import { ArrowLeft, ExternalLink } from "lucide-react";

interface Props {
    statusStyle: { bg: string; border: string; text: string; dot: string; label: string };
    isUnfulfilled: boolean;
    backPath: string;
    shopifyOrderId?: number | string;
    customerId?: number | string;
}

export const OrderHeaderActions: React.FC<Props> = ({ statusStyle, isUnfulfilled, backPath, shopifyOrderId, customerId }) => {
    return (
        <div className="flex flex-col items-end gap-3">
            <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1.5 items-center">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider pl-1 font-montserrat">Current Status</span>
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider pl-1 font-montserrat">Quick Actions</span>

                <div className={`inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-full border text-[11px] font-semibold uppercase tracking-wider shrink-0 shadow-sm ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text} transition-all duration-300`}>
                    <div className={`h-1.5 w-1.5 rounded-full relative ${statusStyle.dot} ${isUnfulfilled ? 'animate-pulse' : ''}`} />
                    <span className="text-left mt-px font-montserrat">{statusStyle.label}</span>
                </div>

                <div className="flex items-center gap-2.5">
                    <button onClick={() => window.location.href = backPath} className="h-9 px-5 rounded-full text-[13px] font-semibold flex items-center justify-center gap-2 shrink-0 transition-all duration-200 bg-slate-50 text-text-primary border border-slate-200 shadow-sm hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5">
                        <ArrowLeft size={14} strokeWidth={2.5} />
                        <span className="font-montserrat leading-none mt-0.5">Back</span>
                    </button>
                </div>
            </div>

            {(shopifyOrderId || customerId) && (
                <div className="flex items-center gap-2">
                    {shopifyOrderId && (
                        <a
                            href={`https://admin.shopify.com/orders/${shopifyOrderId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 px-3.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shrink-0 transition-all duration-200 bg-[#00a294]/10 text-[#008f82] border border-[#00a294]/30 hover:bg-[#00a294]/20 hover:border-[#00a294]/50 hover:-translate-y-0.5"
                        >
                            <ExternalLink size={11} strokeWidth={2.5} />
                            <span className="font-montserrat leading-none mt-0.5">Order Ref #{shopifyOrderId}</span>
                        </a>
                    )}
                    {customerId && (
                        <a
                            href={`https://admin.shopify.com/customers/${customerId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 px-3.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shrink-0 transition-all duration-200 bg-[#00a294]/10 text-[#008f82] border border-[#00a294]/30 hover:bg-[#00a294]/20 hover:border-[#00a294]/50 hover:-translate-y-0.5"
                        >
                            <ExternalLink size={11} strokeWidth={2.5} />
                            <span className="font-montserrat leading-none mt-0.5">Customer Ref #{customerId}</span>
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};
