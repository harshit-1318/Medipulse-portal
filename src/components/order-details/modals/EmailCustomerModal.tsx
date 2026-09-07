import type { ApiResponse } from "../types";

interface EmailCustomerModalProps {
    order: ApiResponse;
    onClose: () => void;
    onSend: (message: string) => void;
}

export function EmailCustomerModal({ order, onClose, onSend }: EmailCustomerModalProps) {
    const handleSend = () => {
        const msgEl = document.getElementById("oc-message") as HTMLTextAreaElement;
        const msg = msgEl?.value.trim();
        if (msg) onSend(msg);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 px-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-text-primary mb-6">Email Customer</h2>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-wider">To</label>
                        <div className="w-full bg-slate-50 p-4 rounded-xl font-semibold text-text-primary border border-slate-200 text-[13px]">{order.customerInfo.email}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-wider">Message</label>
                        <textarea id="oc-message" className="w-full border border-slate-200 rounded-xl bg-slate-50 p-4 text-[13px] font-medium text-text-primary outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-200 transition-all min-h-[150px] resize-none shadow-sm" placeholder="Type your message to the customer here..." />
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button className="flex-1 h-11 rounded-xl bg-slate-100 text-text-secondary font-semibold hover:bg-slate-200 transition-all cursor-pointer text-[13px]" onClick={onClose}>Cancel</button>
                    <button className="flex-1 h-11 rounded-xl bg-[#00D0C1] text-white font-bold hover:shadow-lg transition-all cursor-pointer text-[13px]" onClick={handleSend}>Send Message</button>
                </div>
            </div>
        </div>
    );
}
