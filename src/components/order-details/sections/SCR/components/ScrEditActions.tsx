import { Check, ExternalLink } from "lucide-react";

interface ScrEditActionsProps {
    approveChecked: boolean;
    setApproveChecked: (v: boolean) => void;
    isReadOnly: boolean;
    isCancelled?: boolean;
    onSubmitSCR: () => void;
    onDecline: () => void;
    shopifyOrderId: string;
    hasAtLeastOneFlag: boolean;
}

export function ScrEditActions({
    approveChecked,
    setApproveChecked,
    isReadOnly,
    isCancelled = false,
    onSubmitSCR,
    
    shopifyOrderId,
    hasAtLeastOneFlag,
}: ScrEditActionsProps) {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3 group/approve">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        id="approve-scr"
                        checked={approveChecked}
                        onChange={(e) => setApproveChecked(e.target.checked)}
                        disabled={isReadOnly || !hasAtLeastOneFlag || isCancelled}
                        style={{ accentColor: '#10b981' }}
                        className="peer h-5 w-5 rounded-md border-2 border-slate-200 text-emerald-600 focus:ring-emerald-500/20 transition-all cursor-pointer checked:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
                <label
                    htmlFor="approve-scr"
                    className={`text-[14px] font-semibold tracking-tight transition-colors select-none
                        ${isReadOnly || !hasAtLeastOneFlag || isCancelled
                            ? "text-slate-300 cursor-not-allowed"
                            : approveChecked
                                ? "text-emerald-600 cursor-pointer"
                                : "text-slate-500 cursor-pointer group-hover/approve:text-slate-700"}`}
                >
                    Approve & Release Order
                </label>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                    onClick={onSubmitSCR}
                    disabled={!approveChecked || !hasAtLeastOneFlag || isReadOnly || isCancelled}
                    className="flex-1 md:flex-none h-10 px-6 min-w-[140px] rounded-full bg-emerald-600 
						text-white text-[12px] font-bold uppercase tracking-wider shadow-sm
						hover:bg-emerald-700 transition-all active:scale-95 shadow-emerald-200
						disabled:opacity-30 disabled:active:scale-100 cursor-pointer 
                        flex items-center justify-center gap-2"
                >
                    <Check size={14} strokeWidth={2.5} />
                    SUBMIT
                </button>

                <a
                    href={`https://admin.shopify.com/orders/${shopifyOrderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={isCancelled ? "Order already cancelled" : "Cancel order in Shopify Admin"}
                    className={`flex-1 md:flex-none h-10 px-6 min-w-[140px] rounded-full 
                        text-white text-[12px] font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 
                        flex items-center justify-center gap-2
                        ${isCancelled 
                            ? "bg-slate-300 cursor-not-allowed opacity-60" 
                            : "bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-rose-200 shadow-md"}`}
                    onClick={(e) => isCancelled && e.preventDefault()}
                >
                    <ExternalLink size={14} strokeWidth={2.5} />
                    CANCEL ORDER
                </a>
            </div>
        </div>
    );
}
