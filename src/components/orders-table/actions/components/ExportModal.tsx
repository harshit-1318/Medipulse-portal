import { useEffect } from "react";
import { ExportHeader, ExportOption } from "./export";


interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: Props) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transform transition-all">
                <ExportHeader onClose={onClose} />
                
                <div className="p-8 bg-slate-50/50 flex flex-col md:flex-row gap-6">
                    <ExportOption 
                        title="Current Filters"
                        description="Export only the records matching your currently applied filters. Best for targeted reporting."
                        colorClass="hover:border-indigo-400 hover:shadow-indigo-100/50 focus:ring-indigo-50"
                        onClick={() => { console.log("Exporting current filters..."); onClose(); }}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>}
                    />
                    <ExportOption 
                        title="All Records"
                        description="Export the entire dataset without any filters applied. Useful for full backups or complete data analysis."
                        colorClass="hover:border-green-400 hover:shadow-green-100/50 focus:ring-green-50"
                        onClick={() => { console.log("Exporting all records..."); onClose(); }}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>}
                    />
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
