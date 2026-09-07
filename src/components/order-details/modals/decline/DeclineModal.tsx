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
            await onCancelOrder();
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-99999 px-4 animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                {showConfirm && (
                    <DeclineConfirmationStep 
                        sending={sending}
                        handleConfirm={handleConfirm}
                        onCancel={() => setShowConfirm(false)}
                    />
                )}

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Decline / Cancel Order</h2>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Customer Reason (visible to customer)</label>
                        <select 
                            className="w-full border border-slate-200 rounded-xl bg-slate-50 p-4 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all cursor-pointer"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        >
                            <option value="">Select cancellation reason...</option>
                            <option value="Customer changed their mind">Customer changed their mind</option>
                            <option value="Customer did not respond">Customer did not respond</option>
                            <option value="Clinical unsuitable">Clinical unsuitable</option>
                            <option value="Out of stock">Out of stock</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Internal Staff Note (private)</label>
                        <textarea 
                            className="w-full border border-slate-200 rounded-xl bg-slate-50 p-4 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all min-h-[120px] resize-none"
                            placeholder="Add reason for records..."
                            value={cancelStaffNote}
                            onChange={(e) => setCancelStaffNote(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button 
                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button 
                        className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-md shadow-rose-100 active:scale-95 disabled:opacity-50 cursor-pointer"
                        disabled={!cancelReason || sending}
                        onClick={() => setShowConfirm(true)}
                    >
                        Confirm Cancellation
                    </button>
                </div>
            </div>
        </div>
    );
}
