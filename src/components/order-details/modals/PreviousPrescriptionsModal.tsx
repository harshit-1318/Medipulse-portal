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
                className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.25)] w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 transition-all border border-slate-100" 
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
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                                    {urls.length} {urls.length === 1 ? 'File' : 'Files'} available
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full p-3 transition-all duration-300 cursor-pointer active:scale-90 border border-transparent hover:border-slate-100"
                    >
                        <X size={24} strokeWidth={2} />
                    </button>
                </div>
                
                <div className="p-12 max-h-[65vh] overflow-y-auto custom-scrollbar bg-white">
                    {urls.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-12 ring-slate-50/50">
                                <FileText size={40} className="text-slate-200" />
                            </div>
                            <h3 className="text-[19px] font-bold text-slate-900">No previous prescriptions</h3>
                            <p className="text-[15px] text-slate-400 mt-2 max-w-[280px] leading-relaxed">This customer hasn't uploaded any reference documents yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {urls.map((url, index) => (
                                <button
                                    key={index}
                                    onClick={() => window.open(url, "_blank")}
                                    className="w-full h-[54px] flex items-center justify-between gap-4 px-6 bg-slate-50/40 border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 shadow-sm hover:border-brand-cyan/40 hover:text-brand-cyan hover:bg-brand-cyan/4 hover:shadow-xl hover:shadow-brand-cyan/5 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] group relative overflow-hidden cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-brand-cyan transition-colors" />
                                        <span className="truncate">File {index + 1}</span>
                                    </div>
                                    <ExternalLink size={14} strokeWidth={2.5} className="text-slate-300 group-hover:text-brand-cyan transform transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-12 py-8 border-t border-slate-100 bg-slate-50/40 flex justify-center sticky bottom-0 z-20 backdrop-blur-md">
                    <button 
                        onClick={onClose}
                        className="h-12 px-12 rounded-full text-[14px] font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-95 duration-200 cursor-pointer"
                    >
                        Close Portal
                    </button>
                </div>
            </div>
        </div>
    );
}

