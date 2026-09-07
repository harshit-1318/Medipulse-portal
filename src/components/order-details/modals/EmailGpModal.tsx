import type { ApiResponse } from "../types";

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
                        <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Message</label>
                        <textarea id="gp-message" className="w-full border border-slate-200 rounded-xl bg-slate-50 p-4 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-100 min-h-[150px] resize-none" placeholder="Type your message to the GP here..." />
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-500 font-semibold hover:bg-slate-200 transition-all cursor-pointer" onClick={onClose}>CANCEL</button>
                    <button className="flex-1 py-4 rounded-xl bg-linear-to-r from-[#35D0C6] to-[#35D0C6]/80 text-white font-semibold hover:shadow-lg transition-all cursor-pointer" onClick={handleSend}>SEND EMAIL</button>
                </div>
            </div>
        </div>
    );
}
