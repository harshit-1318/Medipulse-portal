import { AlertTriangle } from "lucide-react";

interface ConfirmUrgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderNumber: string;
    isLoading?: boolean;
}

export function ConfirmUrgentModal({
    isOpen,
    onClose,
    onConfirm,
    orderNumber,
    isLoading = false,
}: ConfirmUrgentModalProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />

            {/* MODAL CONTENT */}
            <div 
                className="relative w-full max-w-[440px] bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 pt-10 flex flex-col items-center text-center">
                    {/* ICON */}
                    <div className="bg-rose-50 text-rose-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-sm ring-4 ring-rose-50/50">
                        <AlertTriangle size={32} strokeWidth={2.5} className="-translate-y-0.5" />
                    </div>

                    <h3 className="text-[20px] font-bold text-slate-900 mb-2 tracking-tight leading-tight">
                        Confirm Action
                    </h3>
                    <p className="text-slate-600 mb-9 max-w-[360px] text-[15.5px] font-medium leading-[1.6] px-2 whitespace-normal">
                        Are you sure you want to mark order <span className="text-[#003B73] font-bold">{orderNumber}</span> as urgent?
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-rose-600 text-white font-bold text-[14px] hover:bg-rose-700 transition-all shadow-md shadow-rose-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Yes, Mark Urgent"
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-[14px] hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}





