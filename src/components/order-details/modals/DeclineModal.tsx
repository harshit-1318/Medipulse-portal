import { useState } from "react";
import { DeclineConfirmationStep } from "./DeclineConfirmationStep";

interface DeclineModalProps {
    onClose: () => void;
    onCancelOrder: () => void;
    cancelReason: string;
    setCancelReason: (v: string) => void;
    cancelStaffNote: string;
    setCancelStaffNote: (v: string) => void;
}

export function DeclineModal({
    onClose,
    onCancelOrder,
    cancelReason,
    setCancelReason,
    cancelStaffNote,
    setCancelStaffNote,
}: DeclineModalProps) {
    const [sending, setSending] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleConfirm = async () => {
        setSending(true);
        try {
            onCancelOrder();
        } finally {
            setSending(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 px-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-7 relative" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Cancel Order</h2>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-wider">Reason for Cancellation</label>
                        <div className="relative group">
                            <select 
                                className="w-full h-11 border border-slate-200 rounded-xl bg-slate-50 px-4 text-[13px] font-medium text-text-primary outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all cursor-pointer appearance-none shadow-sm"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            >
                                <option value="">Select Reason</option>
                                <option value="Customer changed or canceled order">Customer changed or canceled order</option>
                                <option value="Payment declined">Payment declined</option>
                                <option value="Fraudulent order">Fraudulent order</option>
                                <option value="Items unavailable">Items unavailable</option>
                                <option value="Staff error">Staff error</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-wider">Note</label>
                        <textarea 
                            className="w-full border border-slate-200 rounded-xl bg-slate-50 p-4 text-[13px] font-medium text-text-primary placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all shadow-sm min-h-[100px] resize-none"
                            placeholder="Additional internal details..."
                            value={cancelStaffNote}
                            onChange={(e) => setCancelStaffNote(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button 
                        className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-500 font-semibold hover:bg-slate-200 transition-all cursor-pointer" 
                        onClick={onClose}
                    >
                        Keep Order
                    </button>
                    <button 
                        className="flex-1 py-4 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all disabled:opacity-50 cursor-pointer" 
                        disabled={!cancelReason || sending} 
                        onClick={() => setShowConfirm(true)}
                    >
                        Cancel Order
                    </button>
                </div>

                {showConfirm && (
                    <DeclineConfirmationStep
                        sending={sending}
                        handleConfirm={handleConfirm}
                        onCancel={() => setShowConfirm(false)}
                    />
                )}
            </div>
        </div>
    );
}

