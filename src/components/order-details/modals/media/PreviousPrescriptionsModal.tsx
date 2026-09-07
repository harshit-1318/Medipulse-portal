import { X, FileText, ExternalLink } from 'lucide-react';

interface PreviousPrescriptionsModalProps {
    urls: string[];
    onClose: () => void;
}

export function PreviousPrescriptionsModal({ urls, onClose }: PreviousPrescriptionsModalProps) {
    return (
        <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-99999 px-4 animate-in fade-in duration-500" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-4xl shadow-[0_32px_64px_-16px_rgba(15,23,42,0.25)] w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 transition-all border border-slate-100" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-12 py-9 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-[20px] bg-brand-cyan/10 flex items-center justify-center text-brand-cyan shadow-[inset_0_0_0_1.5px_rgba(30,174,181,0.15)] transform transition-transform duration-500 hover:rotate-3">
                            <FileText size={28} strokeWidth={2} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">Previous Prescriptions</h2>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-cyan/10 text-brand-cyan">
                                    {urls.length} Documents
                                </span>
                                <span className="text-[12px] font-medium text-slate-400">Available in customer history</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all flex items-center justify-center active:scale-90 cursor-pointer" 
                        onClick={onClose}
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="p-12 max-h-[65vh] overflow-y-auto space-y-4 bg-slate-50/50">
                    {urls.map((url, idx) => {
                        const fileName = url.split('/').pop() || `Prescription_${idx + 1}.pdf`;
                        return (
                            <div 
                                key={idx} 
                                className="group/item flex items-center justify-between p-6 bg-white rounded-[24px] border border-slate-200/60 hover:border-brand-cyan/30 hover:shadow-xl hover:shadow-brand-cyan/5 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-5 min-w-0 pr-4">
                                    <div className="w-12 h-12 rounded-[16px] bg-slate-50 text-slate-400 flex items-center justify-center group-hover/item:bg-brand-cyan/10 group-hover/item:text-brand-cyan transition-colors duration-300 shrink-0 border border-slate-100">
                                        <FileText size={22} strokeWidth={2} />
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <h4 className="text-[15px] font-bold text-slate-800 truncate group-hover/item:text-brand-cyan transition-colors">
                                            {fileName}
                                        </h4>
                                        <p className="text-[12px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                            <span>Document #{idx + 1}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-teal-600">Verified Upload</span>
                                        </p>
                                    </div>
                                </div>
                                <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-wider bg-brand-cyan text-white shadow-sm shadow-brand-cyan/20 hover:bg-brand-teal hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-95"
                                >
                                    <span>View File</span>
                                    <ExternalLink size={14} strokeWidth={2.5} />
                                </a>
                            </div>
                        );
                    })}
                </div>

                <div className="px-12 py-6 bg-white border-t border-slate-100 flex justify-end">
                    <button 
                        className="px-8 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-bold transition-all active:scale-95 cursor-pointer uppercase tracking-wider" 
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
