import { Search } from "lucide-react";

export const SitesTableEmpty: React.FC = () => {
    return (
        <div className="py-32 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-slate-50 rounded-4xl flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No Sites Found</h3>
            <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
                We couldn't find any site instances matching your current filter criteria.
            </p>
        </div>
    );
};
