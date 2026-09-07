import { Check } from "lucide-react";

interface UrgentSuccessToastProps {
    orderNumber: string;
}

export function UrgentSuccessToast({ orderNumber }: UrgentSuccessToastProps) {
    return (
        <div
            className="fixed bottom-6 right-6 z-100
            flex items-center gap-3
            bg-white text-slate-800
            border border-emerald-100
            px-4 py-3 rounded-xl
            shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)]
            animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 shrink-0">
                <Check size={16} strokeWidth={3} className="text-emerald-600" />
            </div>
            <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-slate-800">
                    Success
                </span>
                <span className="text-[12px] font-medium text-slate-500">
                    Order <span className="text-[#003B73] font-bold">{orderNumber}</span> marked as <span className="text-emerald-600 font-semibold">Urgent</span>
                </span>
            </div>
        </div>
    );
}
