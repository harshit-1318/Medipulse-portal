import type { ApiResponse } from "@/components/order-details/types";

interface EmailGpModalProps {
    order: ApiResponse;
    onClose: () => void;
    onSend: (email: string, message: string) => void;
}

export function EmailGpModal({ onClose, onSend }: EmailGpModalProps) {
    const handleSend = () => {
        const email = (document.getElementById("gp-email") as HTMLInputElement)?.value.trim();
        const msg = (document.getElementById("gp-message") as HTMLTextAreaElement)?.value.trim();
        if (email && msg) onSend(email, msg);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 px-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-text-primary mb-6">Email GP</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">GP Email Address</label>
                        <input id="gp-email" type="email" className="w-full border border-slate-200 rounded-xl bg-slate-50 p-4 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-100 px-5" placeholder="Enter GP's email..." />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Notes</label>
                        <textarea id="gp-message" className="w-full border border-slate-200 rounded-xl bg-slate-50 p-4 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-100 min-h-[120px] px-5" placeholder="Enter additional notes..."></textarea>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button className="px-5 py-2.5 rounded-xl font-semibold text-text-secondary hover:bg-slate-100 text-[13px] transition-colors" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSend}>Send GP Email</button>
                </div>
            </div>
        </div>
    );
}
