import React from "react";
import { Check } from "lucide-react";
import { markOrderUrgent } from "@/api/services/orders";
import { ConfirmUrgentModal } from "../../modals";
import { UrgentSuccessToast } from "../../modals";

type Props = {
    orderId: string;
    orderNumber: string;
    isUrgent: boolean;
    isDisabled?: boolean;
};

export default function UrgentActionButton({ orderId, orderNumber, isUrgent: initialUrgent, isDisabled = false }: Props) {
    const [isUrgent, setIsUrgent] = React.useState(initialUrgent);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);

    React.useEffect(() => {
        setIsUrgent(initialUrgent);
    }, [initialUrgent]);

    const handleUrgentClick = () => {
        if (isUrgent || isDisabled) return;
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await markOrderUrgent(orderId);

            setIsUrgent(true);
            setShowSuccess(true);
            setShowConfirm(false);

            setTimeout(() => setShowSuccess(false), 2500);
        } catch (error) {
            console.error(error);
            alert("Failed to mark order urgent");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleUrgentClick}
                disabled={isUrgent || isLoading || isDisabled}
                title={isDisabled ? "Cannot mark cancelled orders as urgent" : undefined}
                className={`flex items-center justify-center gap-1.5 relative overflow-hidden
				w-27.5 h-8.5 rounded-lg
				text-[11.5px] font-bold font-montserrat tracking-wide
				backdrop-blur-md transition-all duration-300 group
				${isUrgent
                        ? "bg-emerald-50/60 border border-emerald-200/60 text-emerald-700 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.15)] cursor-default"
                        : isDisabled
                            ? "bg-slate-50/60 border border-slate-200/60 text-slate-400 shadow-none cursor-not-allowed"
                            : "bg-white/60 border border-rose-200/60 text-rose-600 shadow-[0_2px_10px_-2px_rgba(244,63,94,0.15)] hover:-translate-y-[1.5px] hover:bg-rose-50/80 hover:border-rose-300/80 hover:shadow-[0_4px_12px_-2px_rgba(244,63,94,0.25)] active:translate-y-0 active:shadow-sm cursor-pointer"}`}
            >
                {!isUrgent && !isDisabled && (
                    <div className="absolute inset-0 bg-linear-to-r from-rose-400/0 via-rose-400/5 to-rose-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                )}

                {isUrgent ? (
                    <Check size={14} strokeWidth={2.5} className="text-emerald-600 relative z-10" />
                ) : isDisabled ? (
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300 relative z-10" />
                ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 relative z-10 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                )}

                <span className="relative z-10">
                    {isLoading ? "Processing..." : isUrgent ? "Marked Urgent" : "Urgent"}
                </span>
            </button>

            <ConfirmUrgentModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirm}
                orderNumber={orderNumber}
                isLoading={isLoading}
            />

            {showSuccess && <UrgentSuccessToast orderNumber={orderNumber} />}
        </>
    );
}
